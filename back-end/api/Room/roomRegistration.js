// C:\Users\Admin\OneDrive - Hanoi University of Science and Technology\backup\kì 6\Project 2\PRJ\quan-ly-ki-tuc-xa\back-end\api\Room\roomRegistration.js
const pool = require("../../database");
// Đảm bảo đường dẫn này trỏ đúng đến file userNotification.js của bạn
// Nếu userNotification.js nằm cùng cấp với thư mục Room, thì đường dẫn là '../UserNotification/userNotification'
// Nếu UserNotification là một thư mục con của api, và Room cũng là thư mục con của api, thì đường dẫn có thể là '../UserNotification/userNotification'
// Dựa trên cấu trúc bạn cung cấp (api/Room/roomRegistration.js và api/UserNotification/userNotification.js), đường dẫn này là đúng:
const { createUserNotificationUtil } = require('../UserNotification/userNotification'); 

exports.createRegistration = async (req, res) => {
    const { user_id, room_id, request_name } = req.body;
    const description = null; // description ban đầu là null
    const initialStatus = 'Pending'; // Trạng thái ban đầu luôn là Pending

    if (!user_id || !room_id || !request_name) {
        return res.status(400).json({ status: "error", message: "Thiếu thông tin bắt buộc: user_id, room_id, request_name." });
    }

    try {
        const result = await pool.query(
            `INSERT INTO ROOMREGISTRATION (user_id, room_id, request_name, description, status) 
             VALUES ($1, $2, $3, $4, $5) RETURNING *`,
            [user_id, room_id, request_name, description, initialStatus]
        );
        
        console.log("New room registration created:", result.rows[0]); 
        res.status(201).json({ status: "success", message: "Yêu cầu đăng ký phòng đã được gửi.", data: result.rows[0] });
    } catch (err) {
        console.error("Error creating room registration:", err.message, err.stack);
        if (err.code === '23503') { // Lỗi khóa ngoại (ví dụ user_id hoặc room_id không tồn tại)
            return res.status(400).json({ status: "error", message: "Thông tin User ID hoặc Room ID không hợp lệ." });
        }
        res.status(500).json({ status: "error", message: "Gửi yêu cầu đăng ký phòng thất bại." });
    }
};

exports.updateRegistration = async (req, res) => {
    const { id } = req.params; // ID của bản ghi ROOMREGISTRATION
    const { status, description } = req.body; // Admin gửi status mới và description (nếu có)

    if (!status) { // Status là bắt buộc khi cập nhật
        return res.status(400).json({ status: "error", message: "Trạng thái mới cho yêu cầu là bắt buộc." });
    }
    
    // description có thể là null nếu admin không nhập
    const finalDescription = description !== undefined ? (description.trim() === '' ? null : description.trim()) : null;

    try {
        const result = await pool.query(
            `UPDATE ROOMREGISTRATION SET status=$1, description=$2 WHERE id=$3 RETURNING *`,
            [status, finalDescription, id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ status: "error", message: "Không tìm thấy yêu cầu để cập nhật." });
        }

        const updatedRegistration = result.rows[0];

        // GỬI THÔNG BÁO CÁ NHÂN CHO USER SAU KHI ADMIN XỬ LÝ
        if (updatedRegistration.user_id && (updatedRegistration.status === 'Approved' || updatedRegistration.status === 'Rejected')) {
            let notificationMessage = '';
            const linkTo = '/status'; // Link đến trang trạng thái của sinh viên trên frontend người dùng

            if (updatedRegistration.status === 'Approved') {
                notificationMessage = `Yêu cầu đăng ký phòng "${updatedRegistration.request_name || 'không tên'}" của bạn đã được DUYỆT. ${updatedRegistration.description ? 'Ghi chú: ' + updatedRegistration.description : ''}`;
            } else if (updatedRegistration.status === 'Rejected') {
                notificationMessage = `Yêu cầu đăng ký phòng "${updatedRegistration.request_name || 'không tên'}" của bạn đã bị TỪ CHỐI. ${updatedRegistration.description ? 'Lý do: ' + updatedRegistration.description : 'Vui lòng liên hệ BQL để biết thêm chi tiết.'}`;
            }
            
            if (notificationMessage) {
                try {
                    // Gọi hàm tiện ích để tạo thông báo
                    await createUserNotificationUtil(updatedRegistration.user_id, notificationMessage, linkTo);
                    console.log(`Personal notification sent to user ${updatedRegistration.user_id} for room registration ${updatedRegistration.id} - Status: ${updatedRegistration.status}`);
                } catch (notifError) {
                    console.error(`Failed to send personal notification for room registration ${updatedRegistration.id}:`, notifError.message, notifError.stack);
                    // Không làm crash request chính nếu gửi thông báo lỗi, chỉ log lại
                }
            }
        }
        // --- KẾT THÚC PHẦN GỬI THÔNG BÁO ---

        res.json({ status: "success", message: "Trạng thái yêu cầu đã được cập nhật thành công.", data: updatedRegistration });
    } catch (err) {
        console.error("Lỗi khi cập nhật yêu cầu đăng ký phòng:", err.message, err.stack);
        res.status(500).json({ status: "error", message: "Cập nhật trạng thái yêu cầu thất bại." });
    }
};

exports.getAllRegistrations = async (req, res) => {
    try {
        // Lấy thêm thông tin người dùng và phòng để hiển thị ở admin cho dễ
        const result = await pool.query(
            `SELECT rr.*, u.fullname as user_fullname, u.email as user_email, r.room_number, r.building_name
             FROM ROOMREGISTRATION rr
             LEFT JOIN USERS u ON rr.user_id = u.id
             LEFT JOIN ROOM r ON rr.room_id = r.id
             ORDER BY rr.id DESC` // Mới nhất lên đầu
        );
        res.json({ status: "success", data: result.rows });
    } catch (err) {
        console.error("Error retrieving registrations:", err.message, err.stack);
        res.status(500).json({ status: "error", message: "Failed to retrieve registrations" });
    }
};

exports.getRegistrationById = async (req, res) => {
    const { id } = req.params;
    try {
        // Lấy thêm thông tin người dùng và phòng
        const result = await pool.query(
            `SELECT rr.*, u.fullname as user_fullname, u.email as user_email, r.room_number, r.building_name
             FROM ROOMREGISTRATION rr
             LEFT JOIN USERS u ON rr.user_id = u.id
             LEFT JOIN ROOM r ON rr.room_id = r.id
             WHERE rr.id = $1`, [id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ status: "error", message: "Registration not found" });
        }
        res.json({ status: "success", data: result.rows[0] });
    } catch (err) {
        console.error("Error retrieving registration:", err.message, err.stack);
        res.status(500).json({ status: "error", message: "Failed to retrieve registration" });
    }
};

exports.getUserRegistrations = async (req, res) => {   
    const { user_id } = req.params;
    // TODO: Nên xác thực user_id này với user_id trong token
    try {
        // Lấy thêm thông tin phòng
        const result = await pool.query(
            `SELECT rr.*, r.room_number, r.building_name
             FROM ROOMREGISTRATION rr
             LEFT JOIN ROOM r ON rr.room_id = r.id
             WHERE rr.user_id = $1 
             ORDER BY rr.id DESC`, [user_id]
        );
        res.json({ status: "success", data: result.rows });
    } catch (err) {
        console.error("Error retrieving user registrations:", err.message, err.stack);
        res.status(500).json({ status: "error", message: "Failed to retrieve user registrations" });
    }
};