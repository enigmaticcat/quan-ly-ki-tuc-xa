// C:\Users\Admin\OneDrive - Hanoi University of Science and Technology\backup\kì 6\Project 2\PRJ\quan-ly-ki-tuc-xa\back-end\api\User\user.js
// const e = require("cors"); // Dòng này có vẻ không cần thiết, cors thường được dùng ở file index.js chính
const pool = require("../../database");
const bcrypt = require("bcrypt");

exports.getUserInfo = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query(`SELECT * FROM USERS WHERE id=$1`, [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ status: "error", message: "User not found" });
        }
        // Loại bỏ password trước khi gửi về client
        const { password, ...userData } = result.rows[0];
        res.json({ status: "success", data: userData });
    } catch (err) {
        console.error("Get User Info Error:", err.message, err.stack);
        res.status(500).json({ status: "error", message: "Failed to retrieve user info" });
    }
};

exports.adminCreateStudent = async (req, res) => {
    console.log("Backend received req.body:", req.body);
    console.log("Backend received req.file:", req.file);
    
    // Lấy tất cả các trường có thể có từ req.body
    // Sử dụng let để có thể gán lại giá trị sau khi kiểm tra chuỗi rỗng
    let { 
        fullname, email, password, phone, address, 
        gender, birthday, user_class, mssv 
    } = req.body;

    const avatarFilename = req.file ? req.file.filename : null;

    // Kiểm tra các trường bắt buộc
    if (!fullname || !email || !password || !mssv) {
        return res.status(400).json({ 
            status: "error", 
            message: "Vui lòng cung cấp đầy đủ thông tin bắt buộc: Họ tên, Email, Mật khẩu, MSSV." 
        });
    }

    // Chuyển đổi chuỗi rỗng thành null cho các trường tùy chọn
    // Điều này đảm bảo rằng nếu frontend gửi chuỗi rỗng (ví dụ: người dùng không chọn/nhập),
    // giá trị NULL sẽ được chèn vào database cho các cột cho phép NULL.
    phone = phone === '' ? null : phone;
    address = address === '' ? null : address;
    gender = gender === '' ? null : gender;
    birthday = birthday === '' ? null : birthday; // Quan trọng cho lỗi "invalid input syntax for type date"
    user_class = user_class === '' ? null : user_class;

    try {
        const existingUser = await pool.query(
            'SELECT id FROM USERS WHERE email = $1 OR mssv = $2',
            [email, mssv]
        );

        if (existingUser.rows.length > 0) {
            return res.status(409).json({
                status: "error",
                message: "Email hoặc MSSV đã được sử dụng.",
            });
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const newUserResult = await pool.query(
            `INSERT INTO USERS(fullname, email, password, phone, address, gender, birthday, user_class, mssv, avatar) 
             VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) 
             RETURNING id, fullname, email, mssv, user_class, phone, address, gender, birthday, avatar, role`, // Thêm role vào RETURNING nếu có
            [fullname, email, hashedPassword, phone, address, gender, birthday, user_class, mssv, avatarFilename]
        );
        
        // Lấy user vừa tạo (đã loại bỏ password từ DB)
        const newUser = newUserResult.rows[0];
        // Nếu bạn có cột role và muốn nó được trả về, đảm bảo RETURNING có 'role'

        res.status(201).json({
            status: "success",
            message: "Tạo tài khoản sinh viên thành công!",
            data: newUser 
        });

    } catch (err) {
        console.error("Lỗi khi admin tạo sinh viên:", err.message, err.stack);
        if (err.code === '23505') { // Unique violation
             return res.status(409).json({
                status: "error",
                message: "Thông tin bị trùng lặp (Email hoặc MSSV đã tồn tại).",
            });
        }
        // Cụ thể hóa lỗi cho "invalid input syntax for type date" nếu vẫn xảy ra
        if (err.message.includes("invalid input syntax for type date")) {
            return res.status(400).json({
                status: "error",
                message: "Định dạng ngày sinh không hợp lệ. Vui lòng kiểm tra lại.",
                errorDetail: err.message
            });
        }
        res.status(500).json({
            status: "error",
            message: "Đã có lỗi xảy ra phía server khi tạo sinh viên.",
            errorDetail: err.message 
        });
    }
};

exports.getAllUsers = async (req, res) => {
    try {
        const result = await pool.query(`SELECT id, fullname, email, phone, address, gender, birthday, user_class, mssv, avatar, role FROM USERS ORDER BY id ASC`); // Thêm role, avatar và ORDER BY
        // Không gửi password về client
        res.json({ status: "success", data: result.rows });
    } catch (err) {
        console.error("Get All Users Error:", err.message, err.stack);
        res.status(500).json({ status: "error", message: "Failed to retrieve users" });
    }
};

exports.updateUserInfo = async (req, res) => {
    console.log("Update UserInfo req.body:", req.body);
    console.log("Update UserInfo req.file:", req.file);
    const { id } = req.params;
    const possibleFields = ['fullname', 'email', 'phone', 'address', 'gender', 'birthday', 'user_class', 'mssv', 'role']; // Thêm 'role' nếu admin có thể sửa
    const updates = [];
    const values = [];
    let paramIndex = 1;

    for (let field of possibleFields) {
        // Chỉ cập nhật nếu trường được gửi lên và không phải là chuỗi rỗng (trừ email có thể cho phép rỗng nếu logic cho phép)
        // Hoặc nếu là birthday, gender mà rỗng thì set là NULL
        let valueToSet = req.body[field];

        if (valueToSet !== undefined) { // Kiểm tra undefined thay vì chỉ truthy/falsy
            if ((field === 'birthday' || field === 'gender' || field === 'phone' || field === 'address' || field === 'user_class' || field === 'role') && valueToSet === '') {
                valueToSet = null;
            }
            
            // Chỉ thêm vào câu lệnh UPDATE nếu giá trị không phải là undefined sau khi xử lý
            // (email có thể là trường hợp đặc biệt nếu bạn muốn cho phép xóa email, nhưng thường thì không)
            if (valueToSet !== undefined) { 
                updates.push(`${field} = $${paramIndex}`);
                values.push(valueToSet);
                paramIndex++;
            }
        }
    }

    if (req.file) {
        updates.push(`avatar = $${paramIndex}`);
        values.push(req.file.filename);
        paramIndex++;
    }

    if (updates.length === 0) {
        return res.status(400).json({ status: "error", message: 'Không có thông tin hợp lệ để cập nhật.' });
    }

    values.push(id);
    const queryText = `UPDATE USERS SET ${updates.join(', ')} WHERE id = $${paramIndex} RETURNING id, fullname, email, phone, address, gender, birthday, user_class, mssv, avatar, role`;

    try {
        const result = await pool.query(queryText, values);
        if (result.rows.length === 0) {
            return res.status(404).json({ status: "error", message: "Không tìm thấy người dùng để cập nhật." });
        }
        const { password, ...updatedUser } = result.rows[0]; // Loại bỏ password
        res.status(200).json({ status: "success", message: 'Cập nhật thông tin sinh viên thành công.', data: updatedUser });
    } catch (err) {
        console.error('Lỗi khi cập nhật thông tin sinh viên:', err.message, err.stack);
        if (err.code === '23505') {
            return res.status(409).json({ status: "error", message: 'Thông tin bị trùng lặp (Email hoặc MSSV).'});
        }
        if (err.message.includes("invalid input syntax for type date")) {
            return res.status(400).json({
                status: "error",
                message: "Định dạng ngày sinh không hợp lệ. Vui lòng kiểm tra lại.",
                errorDetail: err.message
            });
        }
        res.status(500).json({ status: "error", message: 'Lỗi server khi cập nhật thông tin.', errorDetail: err.message });
    }
};

exports.deleteUser = async (req, res) => {
    const { id } = req.params; // Lấy id từ URL parameters
    try {
        // Câu lệnh SQL: DELETE FROM USERS WHERE id=$1
        // pool.query cần 2 tham số: câu lệnh SQL và một mảng các giá trị cho tham số
        const result = await pool.query(`DELETE FROM USERS WHERE id=$1 RETURNING id`, [id]); // << TRUYỀN THAM SỐ [id] VÀO ĐÂY

        if (result.rowCount === 0) { // Kiểm tra xem có hàng nào bị xóa không
            return res.status(404).json({ status: "error", message: "Không tìm thấy người dùng để xóa." });
        }
        res.json({ status: "success", message: "User deleted successfully" });
    } catch (err) {
        console.error("Delete User Error:", err.message, err.stack);
        res.status(500).json({ status: "error", message: "User deletion failed" });
    }
};