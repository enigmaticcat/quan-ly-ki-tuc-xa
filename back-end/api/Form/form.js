const pool = require("../../database");

// Sinh viên tạo yêu cầu mới (có thể có file đính kèm)
exports.createForm = async (req, res) => {
    // Giả sử user_id được lấy từ token đã xác thực (nếu có middleware protect)
    // Hoặc frontend gửi user_id (cần xác thực user_id này có đúng là của người đang gửi không)
    // Để đơn giản, tạm thời lấy user_id từ req.body (frontend sẽ gửi)
    const { user_id, form_description, form_type } = req.body;
    const attachmentFile = req.file; // Từ multer upload.single('attachmentFile')

    if (!user_id || !form_description || !form_type) {
        return res.status(400).json({ status: "error", message: "Thiếu thông tin bắt buộc (user_id, mô tả, loại đơn)." });
    }

    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        // 1. Insert vào bảng FORMS
        const formStatus = 'Pending'; // Trạng thái mặc định khi mới tạo
        const formResult = await client.query(
            `INSERT INTO FORMS (user_id, form_description, form_type, form_status) 
             VALUES ($1, $2, $3, $4) RETURNING id, created_at`,
            [user_id, form_description, form_type, formStatus]
        );
        const newForm = formResult.rows[0];

        // 2. Nếu có file đính kèm, insert vào bảng ATTACHMENTS
        if (attachmentFile) {
            await client.query(
                `INSERT INTO ATTACHMENTS (form_id, filename, file_url) 
                 VALUES ($1, $2, $3)`,
                [newForm.id, attachmentFile.originalname, attachmentFile.filename] // filename là tên đã đổi bởi multer
            );
        }

        await client.query('COMMIT');
        res.status(201).json({ 
            status: "success", 
            message: "Yêu cầu đơn từ đã được gửi thành công.",
            data: { form_id: newForm.id, created_at: newForm.created_at, attachment: attachmentFile ? attachmentFile.filename : null }
        });

    } catch (err) {
        await client.query('ROLLBACK');
        console.error("Lỗi khi tạo đơn từ:", err.message, err.stack);
        res.status(500).json({ status: "error", message: "Lỗi server khi tạo đơn từ." });
    } finally {
        client.release();
    }
};

// Admin lấy tất cả đơn từ (có thể thêm phân trang, filter sau)
exports.getAllForms = async (req, res) => {
    try {
        // JOIN với USERS để lấy tên người gửi
        const result = await pool.query(
            `SELECT f.*, u.fullname as user_fullname, u.email as user_email 
             FROM FORMS f
             LEFT JOIN USERS u ON f.user_id = u.id
             ORDER BY f.created_at DESC`
        );
        res.json({ status: "success", data: result.rows });
    } catch (err) {
        console.error("Lỗi khi lấy tất cả đơn từ:", err.message, err.stack);
        res.status(500).json({ status: "error", message: "Lỗi server khi lấy danh sách đơn từ." });
    }
};

// Lấy chi tiết một đơn từ (bao gồm file đính kèm)
exports.getFormById = async (req, res) => {
    const { id } = req.params; // form_id
    try {
        const formResult = await pool.query(
            `SELECT f.*, u.fullname as user_fullname, u.email as user_email
             FROM FORMS f
             LEFT JOIN USERS u ON f.user_id = u.id
             WHERE f.id = $1`, [id]
        );
        if (formResult.rows.length === 0) {
            return res.status(404).json({ status: "error", message: "Không tìm thấy đơn từ." });
        }
        const form = formResult.rows[0];

        // Lấy file đính kèm (nếu có)
        const attachmentsResult = await pool.query(
            `SELECT id, filename, file_url FROM ATTACHMENTS WHERE form_id = $1`, [id]
        );
        form.attachments = attachmentsResult.rows; // Có thể có nhiều file, hiện tại logic là 1 file/form

        res.json({ status: "success", data: form });
    } catch (err) {
        console.error("Lỗi khi lấy chi tiết đơn từ:", err.message, err.stack);
        res.status(500).json({ status: "error", message: "Lỗi server." });
    }
};

// Admin cập nhật trạng thái và phản hồi cho đơn từ
exports.updateForm = async (req, res) => {
    const { id } = req.params; // form_id
    const { form_status, form_reply } = req.body; // Admin sẽ gửi status mới và reply

    if (!form_status) {
        return res.status(400).json({ status: "error", message: "Trạng thái đơn là bắt buộc." });
    }

    try {
        const result = await pool.query(
            `UPDATE FORMS SET form_status = $1, form_reply = $2 
             WHERE id = $3 RETURNING *`,
            [form_status, form_reply || null, id]
        );
        if (result.rowCount === 0) {
            return res.status(404).json({ status: "error", message: "Không tìm thấy đơn từ để cập nhật." });
        }
        res.json({ status: "success", message: "Cập nhật đơn từ thành công.", data: result.rows[0] });
    } catch (err) {
        console.error("Lỗi khi cập nhật đơn từ:", err.message, err.stack);
        res.status(500).json({ status: "error", message: "Lỗi server khi cập nhật đơn từ." });
    }
};

// Sinh viên lấy các đơn từ của mình
exports.getUserForms = async (req, res) => {
    const { user_id } = req.params; 
    // TODO: API này nên được bảo vệ, user_id nên lấy từ token đã xác thực
    // Hoặc ít nhất kiểm tra user_id từ token có khớp với user_id trong params không.
    try {
        const result = await pool.query(
            `SELECT f.* FROM FORMS f
             WHERE f.user_id = $1
             ORDER BY f.created_at DESC`, [user_id]
        );
        res.json({ status: "success", data: result.rows });
    } catch (err) {
        console.error("Lỗi khi lấy đơn từ của người dùng:", err.message, err.stack);
        res.status(500).json({ status: "error", message: "Lỗi server." });
    }
};