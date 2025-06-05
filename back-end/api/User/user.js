const e = require("cors");
const pool = require("../../database");

exports.getUserInfo = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query(`SELECT * FROM USERS WHERE id=$1`, [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ status: "error", message: "User not found" });
        }
        res.json({ status: "success", data: result.rows[0] });
    } catch (err) {
        console.error("Get User Info Error:", err.message);
        res.status(500).json({ status: "error", message: "Failed to retrieve user info" });
    }
}
exports.getAllUsers = async (req, res) => {
    try {
        const result = await pool.query(`SELECT * FROM USERS`);
        res.json({ status: "success", data: result.rows });
    } catch (err) {
        console.error("Get All Users Error:", err.message);
        res.status(500).json({ status: "error", message: "Failed to retrieve users" });
    }
}
exports.updateUserInfo = async (req, res) => {
    const { id } = req.params;
    const fields = ['name', 'email', 'phone', 'address', 'gender', 'birthday', 'user_class', 'mssv'];
    const updates = [];
    const values = [];
    let i = 1;

    for (let field of fields) {
        if (req.body[field] !== undefined) {
            updates.push(`${field} = $${i}`);
            values.push(req.body[field]);
            i++;
        }
    }

    if (updates.length === 0) {
        return res.status(400).json({ message: 'No valid fields to update.' });
    }

    values.push(id); // Add ID as last parameter

    const query = `UPDATE users SET ${updates.join(', ')} WHERE id = $${i}`;

    try {
        await pool.query(query, values);
        res.status(200).json({ message: 'User info updated successfully.' });
    } catch (err) {
        console.error('Error updating user info:', err.message);
        res.status(500).json({ error: 'Failed to update user info.' });
    }
};
exports.deleteUser = async (req, res) => {
    const { id } = req.params;
    try {
        // Because of ON DELETE CASCADE, USER_ACCOMMODATION rows are auto-deleted
        await pool.query(`DELETE FROM USERS WHERE id=$1`, [id]);
        res.json({ status: "success", message: "User deleted successfully" });
    } catch (err) {
        console.error("Delete User Error:", err.message);
        res.status(500).json({ status: "error", message: "User deletion failed" });
    }
}

    