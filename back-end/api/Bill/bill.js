const pool = require("../../database");

exports.createBill = async (req, res) => {
    const { user_id, bill_date, items } = req.body;
    // items = [{ item_type: "Room Rent", amount: 2000000 }, ...]

    const client = await pool.connect();
    try {
        await client.query("BEGIN");

        const billRes = await client.query(
            `INSERT INTO BILLS (user_id, bill_date) VALUES ($1, $2) RETURNING id`,
            [user_id, bill_date]
        );
        const billId = billRes.rows[0].id;

        for (let item of items) {
            await client.query(
                `INSERT INTO BILLITEMS (bill_id, item_type, amount) VALUES ($1, $2, $3)`,
                [billId, item.item_type, item.amount]
            );
        }

        await client.query("COMMIT");
        res.status(201).json({ status: "success", message: "Bill created" });
    } catch (err) {
        await client.query("ROLLBACK");
        console.error("Error creating bill:", err.message);
        res.status(500).json({ status: "error", message: "Failed to create bill" });
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
    const { id } = req.params;

    try {
        const result = await pool.query(
            `SELECT * FROM BILLS WHERE id=$1`,
            [id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ status: "error", message: "Bill not found" });
        }
        res.json({ status: "success", data: result.rows[0] });
    } catch (err) {
        console.error("Error retrieving bill:", err.message);
        res.status(500).json({ status: "error", message: "Failed to retrieve bill" });
    }
}

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
        const result = await pool.query(
            `SELECT * FROM BILLS WHERE user_id=$1`,
            [user_id]
        );
        res.json({ status: "success", data: result.rows });
    } catch (err) {
        console.error("Error retrieving user bills:", err.message);
        res.status(500).json({ status: "error", message: "Failed to retrieve user bills" });
    }
}