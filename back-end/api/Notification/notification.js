// back-end/api/Notification/notification.js
const pool = require("../../database");

// Admin tạo thông báo mới
exports.createNotification = async (req, res) => {
    const { title, content, author_id, is_published } = req.body; // author_id có thể lấy từ token admin
    if (!title || !content) {
        return res.status(400).json({ status: "error", message: "Tiêu đề và nội dung là bắt buộc." });
    }
    try {
        const result = await pool.query(
            `INSERT INTO NOTIFICATIONS (title, content, author_id, is_published) 
             VALUES ($1, $2, $3, $4) RETURNING *`,
            [title, content, author_id || null, is_published !== undefined ? is_published : true]
        );
        res.status(201).json({ status: "success", message: "Tạo thông báo thành công.", data: result.rows[0] });
    } catch (err) {
        console.error("Lỗi khi tạo thông báo:", err.message, err.stack);
        res.status(500).json({ status: "error", message: "Lỗi server khi tạo thông báo." });
    }
};

// Lấy tất cả thông báo (cho cả admin quản lý và sinh viên xem) - chỉ lấy những cái đã published
exports.getAllPublishedNotifications = async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT id, title, content, created_at 
             FROM NOTIFICATIONS 
             WHERE is_published = TRUE 
             ORDER BY created_at DESC` // Mới nhất lên đầu
        );
        res.json({ status: "success", data: result.rows });
    } catch (err) {
        console.error("Lỗi khi lấy thông báo:", err.message, err.stack);
        res.status(500).json({ status: "error", message: "Lỗi server khi lấy thông báo." });
    }
};

// (Admin) Lấy tất cả thông báo (bao gồm cả chưa published để quản lý)
exports.adminGetAllNotifications = async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT n.id, n.title, n.content, n.created_at, n.is_published, u.fullname as author_name 
             FROM NOTIFICATIONS n
             LEFT JOIN USERS u ON n.author_id = u.id
             ORDER BY n.created_at DESC`
        );
        res.json({ status: "success", data: result.rows });
    } catch (err) {
        console.error("Lỗi khi admin lấy thông báo:", err.message, err.stack);
        res.status(500).json({ status: "error", message: "Lỗi server." });
    }
};

// (Admin) Cập nhật thông báo
exports.updateNotification = async (req, res) => {
    const { id } = req.params;
    const { title, content, is_published } = req.body;
    if (!title && !content && is_published === undefined) {
        return res.status(400).json({ status: "error", message: "Không có thông tin để cập nhật." });
    }
    
    // Xây dựng câu lệnh update động
    const fieldsToUpdate = [];
    const values = [];
    let queryParamIndex = 1;

    if (title !== undefined) {
        fieldsToUpdate.push(`title = $${queryParamIndex++}`);
        values.push(title);
    }
    if (content !== undefined) {
        fieldsToUpdate.push(`content = $${queryParamIndex++}`);
        values.push(content);
    }
    if (is_published !== undefined) {
        fieldsToUpdate.push(`is_published = $${queryParamIndex++}`);
        values.push(is_published);
    }
    
    if (fieldsToUpdate.length === 0) {
         return res.status(400).json({ status: "error", message: "Không có trường hợp lệ để cập nhật." });
    }

    values.push(id); // Thêm ID vào cuối cho điều kiện WHERE

    try {
        const result = await pool.query(
            `UPDATE NOTIFICATIONS SET ${fieldsToUpdate.join(', ')} WHERE id = $${queryParamIndex} RETURNING *`,
            values
        );
        if (result.rowCount === 0) {
            return res.status(404).json({ status: "error", message: "Không tìm thấy thông báo." });
        }
        res.json({ status: "success", message: "Cập nhật thông báo thành công.", data: result.rows[0] });
    } catch (err) {
        console.error("Lỗi khi cập nhật thông báo:", err.message, err.stack);
        res.status(500).json({ status: "error", message: "Lỗi server." });
    }
};

// (Admin) Xóa thông báo
exports.deleteNotification = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query("DELETE FROM NOTIFICATIONS WHERE id = $1 RETURNING id", [id]);
        if (result.rowCount === 0) {
            return res.status(404).json({ status: "error", message: "Không tìm thấy thông báo." });
        }
        res.json({ status: "success", message: "Xóa thông báo thành công." });
    } catch (err) {
        console.error("Lỗi khi xóa thông báo:", err.message, err.stack);
        res.status(500).json({ status: "error", message: "Lỗi server." });
    }
};