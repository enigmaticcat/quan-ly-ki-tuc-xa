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
exports.updateUserInfo = async (req, res) => {
    const { id } = req.params;
    const { name, email, phone, address, gender, birthday } = req.body;

    try {
        await pool.query(
            `UPDATE users 
             SET name = $1, email = $2, phone = $3, address = $4, gender = $5, birthday = $6 
             WHERE id = $7`,
            [name, email, phone, address, gender, birthday, id]
        );

        res.status(200).json({ message: 'User info updated successfully.' });
    } catch (error) {
        console.error('Error updating user info:', error);
        res.status(500).json({ error: 'An error occurred while updating user info.' });
    }
};


    