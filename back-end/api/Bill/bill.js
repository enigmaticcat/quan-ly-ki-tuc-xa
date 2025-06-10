const pool = require("../../database");
const { createUserNotificationUtil } = require('../UserNotification/userNotification');

exports.createBill = async (req, res) => {
    const { user_id, bill_date, items } = req.body; // items là một mảng: [{ item_type: "...", amount: ... }]

    if (!user_id || !bill_date || !items || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ status: "error", message: "Thiếu thông tin user_id, bill_date hoặc các mục chi phí (items)." });
    }
    // Kiểm tra tính hợp lệ của từng item
    for (const item of items) {
        if (!item.item_type || item.amount === undefined || isNaN(parseFloat(item.amount)) || parseFloat(item.amount) <= 0) {
            return res.status(400).json({ status: "error", message: "Mỗi mục chi phí phải có item_type và amount hợp lệ (số dương)." });
        }
    }

    const client = await pool.connect();
    try {
        await client.query("BEGIN");

        // Mặc định status là 'unpaid' hoặc 'Pending' khi tạo hóa đơn
        // Dựa theo file backup.sql, bảng BILLS có DEFAULT 'unpaid' cho status
        // Nên không cần truyền status vào đây nếu muốn dùng default.
        // Nếu muốn tường minh, bạn có thể thêm cột status và giá trị 'unpaid' hoặc 'Pending' vào INSERT.
        const billRes = await client.query(
            `INSERT INTO BILLS (user_id, bill_date) VALUES ($1, $2) RETURNING id, user_id, bill_date, status`, // Thêm status vào RETURNING
            [user_id, bill_date]
        );
        const newBill = billRes.rows[0]; // Thông tin hóa đơn vừa tạo
        const billId = newBill.id;

        let totalAmount = 0;
        for (let item of items) {
            await client.query(
                `INSERT INTO BILLITEMS (bill_id, item_type, amount) VALUES ($1, $2, $3)`,
                [billId, item.item_type, parseFloat(item.amount)]
            );
            totalAmount += parseFloat(item.amount);
        }

        await client.query("COMMIT");

        // --- GỬI THÔNG BÁO CÁ NHÂN CHO USER SAU KHI TẠO HÓA ĐƠN ---
        if (newBill.user_id) {
            const notificationMessage = `Bạn có một hóa đơn mới #${newBill.id} (ngày ${new Date(newBill.bill_date).toLocaleDateString('vi-VN')}) với tổng số tiền ${totalAmount.toLocaleString('vi-VN')} VNĐ cần thanh toán.`;
            const linkTo = '/check-out'; // Link đến trang thanh toán của sinh viên

            try {
                await createUserNotificationUtil(newBill.user_id, notificationMessage, linkTo);
                console.log(`Personal notification sent to user ${newBill.user_id} for new bill ${newBill.id}`);
            } catch (notifError) {
                console.error(`Failed to send personal notification for new bill ${newBill.id}:`, notifError.message, notifError.stack);
            }
        }
        // --- KẾT THÚC PHẦN GỬI THÔNG BÁO ---

        res.status(201).json({ 
            status: "success", 
            message: "Hóa đơn đã được tạo thành công.", 
            data: { bill_id: billId, user_id: newBill.user_id, bill_date: newBill.bill_date, status: newBill.status, items_count: items.length, total_amount: totalAmount }
        });
    } catch (err) {
        await client.query("ROLLBACK");
        console.error("Lỗi khi tạo hóa đơn:", err.message, err.stack);
        res.status(500).json({ status: "error", message: "Tạo hóa đơn thất bại." });
    } finally {
        client.release();
    }
};
exports.updateBill = async (req, res) => {
    const { id } = req.params;
    const { user_id, bill_date, items } = req.body;

    const client = await pool.connect();
    try {
        await client.query("BEGIN");

        await client.query(
            `UPDATE BILLS SET user_id=$1, bill_date=$2 WHERE id=$3`,
            [user_id, bill_date, id]
        );

        await client.query(`DELETE FROM BILLITEMS WHERE bill_id=$1`, [id]);

        for (let item of items) {
            await client.query(
                `INSERT INTO BILLITEMS (bill_id, item_type, amount) VALUES ($1, $2, $3)`,
                [id, item.item_type, item.amount]
            );
        }

        await client.query("COMMIT");
        res.json({ status: "success", message: "Bill updated" });
    } catch (err) {
        await client.query("ROLLBACK");
        console.error("Error updating bill:", err.message);
        res.status(500).json({ status: "error", message: "Failed to update bill" });
    } finally {
        client.release();
    }
};
exports.updateBillStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    try {
        await pool.query(
            `UPDATE BILLS SET status=$1 WHERE id=$2`,
            [status, id]
        );
        res.json({ status: "success", message: "Bill status updated" });
    } catch (err) {
        console.error("Error updating bill status:", err.message);
        res.status(500).json({ status: "error", message: "Failed to update bill status" });
    }
};
exports.getAllBills = async (req, res) => {
    try {
        const result = await pool.query(`SELECT * FROM BILLS`);
        res.json({ status: "success", data: result.rows });
    } catch (err) {
        console.error("Error retrieving bills:", err.message);
        res.status(500).json({ status: "error", message: "Failed to retrieve bills" });
    }
};

exports.getBillById = async (req, res) => {
    const { id } = req.params; // id này là của hóa đơn (BILLS.id)

    try {
        // Lấy thông tin hóa đơn chính
        const billResult = await pool.query(
            `SELECT b.*, u.fullname as user_fullname, u.email as user_email 
             FROM BILLS b
             LEFT JOIN USERS u ON b.user_id = u.id 
             WHERE b.id = $1`,
            [id]
        );

        if (billResult.rows.length === 0) {
            return res.status(404).json({ status: "error", message: "Bill not found" });
        }

        const bill = billResult.rows[0];

        // Lấy các mục chi tiết của hóa đơn (bill items)
        const itemsResult = await pool.query(
            `SELECT id, item_type, amount FROM BILLITEMS WHERE bill_id = $1 ORDER BY id ASC`,
            [id]
        );

        // Gộp thông tin lại
        const billDetail = {
            ...bill,
            items: itemsResult.rows
        };
        
        // Tính tổng tiền nếu chưa có trong bảng BILLS
        // Hoặc bạn có thể đã có một cột total_amount trong BILLS
        let totalAmount = 0;
        if (billDetail.items && billDetail.items.length > 0) {
            totalAmount = billDetail.items.reduce((sum, item) => sum + parseFloat(item.amount), 0);
        }
        billDetail.calculated_total_amount = totalAmount; // Thêm trường tổng tiền đã tính

        res.json({ status: "success", data: billDetail });

    } catch (err) {
        console.error("Lỗi khi lấy chi tiết hóa đơn:", err.message, err.stack);
        res.status(500).json({ status: "error", message: "Lỗi server khi lấy chi tiết hóa đơn." });
    }
};

exports.deleteBill = async (req, res) => {
    const { id } = req.params;

    const client = await pool.connect();
    try {
        await client.query("BEGIN");

        await client.query(`DELETE FROM BILLITEMS WHERE bill_id=$1`, [id]);
        await client.query(`DELETE FROM BILLS WHERE id=$1`, [id]);

        await client.query("COMMIT");
        res.json({ status: "success", message: "Bill deleted" });
    } catch (err) {
        await client.query("ROLLBACK");
        console.error("Error deleting bill:", err.message);
        res.status(500).json({ status: "error", message: "Failed to delete bill" });
    } finally {
        client.release();
    }
}

exports.getBillByUserId = async (req, res) => {
    const { user_id } = req.params;

    try {
        // Lấy tất cả hóa đơn của user
        const billsResult = await pool.query(
            `SELECT * FROM BILLS WHERE user_id = $1 ORDER BY bill_date DESC, id DESC`, // Sắp xếp để lấy hóa đơn mới nhất
            [user_id]
        );

        if (billsResult.rows.length === 0) {
            return res.json({ status: "success", data: [], message: "Không tìm thấy hóa đơn nào." });
        }

        // Với mỗi hóa đơn, lấy các bill items tương ứng
        const billsWithItems = await Promise.all(billsResult.rows.map(async (bill) => {
            const itemsResult = await pool.query(
                `SELECT id, item_type, amount FROM BILLITEMS WHERE bill_id = $1`,
                [bill.id]
            );
            return { ...bill, items: itemsResult.rows };
        }));
        
        // Để đơn giản cho trang Checkout, ta có thể chỉ lấy hóa đơn gần nhất chưa thanh toán
        // Hoặc frontend sẽ tự lọc. Hiện tại trả về tất cả.
        res.json({ status: "success", data: billsWithItems });

    } catch (err) {
        console.error("Lỗi khi lấy hóa đơn của người dùng:", err.message, err.stack);
        res.status(500).json({ status: "error", message: "Lỗi server khi lấy hóa đơn." });
    }
};