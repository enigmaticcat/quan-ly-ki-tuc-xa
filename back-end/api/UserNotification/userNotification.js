// back-end/api/UserNotification/userNotification.js
const pool = require("../../database");

// Hàm tiện ích để tạo thông báo (có thể gọi từ các controller khác)
const createUserNotification = async (userId, message, linkTo = null) => {
    try {
        await pool.query(
            `INSERT INTO USER_PERSONAL_NOTIFICATIONS (user_id, message, link_to) VALUES ($1, $2, $3)`,
            [userId, message, linkTo]
        );
        // console.log(`Notification created for user ${userId}: ${message}`);
        // Ở đây có thể dùng WebSocket/SSE để đẩy thông báo real-time đến client nếu muốn nâng cao
    } catch (error) {
        console.error("Error creating user notification:", error);
    }
};
// Export hàm này để các controller khác có thể dùng
// Ví dụ: khi admin duyệt đơn trong roomRegistration.js, gọi createUserNotification
// exports.createUserNotificationUtil = createUserNotification; 

// API: Lấy các thông báo chưa đọc của user
exports.getUnreadUserNotifications = async (req, res) => {
    // Giả sử user_id được lấy từ token đã xác thực (req.user.id)
    // Để đơn giản, tạm thời lấy từ req.params nếu frontend gửi
    const { userId } = req.params; // Hoặc const userId = req.user.id; nếu có middleware protect

    if (!userId) {
        return res.status(400).json({ status: "error", message: "User ID is required." });
    }

    try {
        const result = await pool.query(
            `SELECT id, message, link_to, created_at 
             FROM USER_PERSONAL_NOTIFICATIONS 
             WHERE user_id = $1 AND is_read = FALSE 
             ORDER BY created_at DESC LIMIT 10`, // Lấy 10 thông báo mới nhất chưa đọc
            [userId]
        );
        const unreadCountResult = await pool.query(
            `SELECT COUNT(id) as count FROM USER_PERSONAL_NOTIFICATIONS WHERE user_id = $1 AND is_read = FALSE`,
            [userId]
        );
        res.json({ 
            status: "success", 
            data: result.rows, 
            unreadCount: parseInt(unreadCountResult.rows[0].count, 10) || 0 
        });
    } catch (err) {
        console.error("Lỗi lấy thông báo user:", err.message, err.stack);
        res.status(500).json({ status: "error", message: "Lỗi server." });
    }
};

// API: Đánh dấu một thông báo đã đọc
exports.markNotificationAsRead = async (req, res) => {
    const { notificationId } = req.params;
    // const userId = req.user.id; // Lấy từ token để đảm bảo user chỉ mark read thông báo của mình

    try {
        // Thêm điều kiện user_id vào WHERE nếu muốn bảo mật hơn
        const result = await pool.query(
            `UPDATE USER_PERSONAL_NOTIFICATIONS SET is_read = TRUE 
             WHERE id = $1 RETURNING id`, // AND user_id = $2
            [notificationId] //, userId
        );
        if (result.rowCount === 0) {
            return res.status(404).json({ status: "error", message: "Không tìm thấy thông báo."});
        }
        res.json({ status: "success", message: "Đánh dấu đã đọc thành công." });
    } catch (err) {
        console.error("Lỗi đánh dấu đã đọc:", err.message, err.stack);
        res.status(500).json({ status: "error", message: "Lỗi server." });
    }
};

// API: Đánh dấu tất cả thông báo đã đọc
exports.markAllNotificationsAsRead = async (req, res) => {
    const { userId } = req.params; // Hoặc const userId = req.user.id;
    if (!userId) return res.status(400).json({status: "error", message: "User ID is required."});
    try {
        await pool.query(
            `UPDATE USER_PERSONAL_NOTIFICATIONS SET is_read = TRUE WHERE user_id = $1 AND is_read = FALSE`,
            [userId]
        );
        res.json({ status: "success", message: "Đã đánh dấu tất cả là đã đọc." });
    } catch (err) {
        console.error("Lỗi đánh dấu tất cả đã đọc:", err.message, err.stack);
        res.status(500).json({ status: "error", message: "Lỗi server." });
    }
};

// Làm cho hàm createUserNotification có thể được gọi từ các module khác
module.exports.createUserNotificationUtil = createUserNotification;