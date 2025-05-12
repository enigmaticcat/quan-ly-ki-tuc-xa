const pool = require("../database");

exports.createRegistration = async (req, res) => {
    const { user_id, room_id, request_name } = req.body;
    const description = null; // explicitly set to null

    try {
        await pool.query(
            `INSERT INTO RoomRegistration (user_id, room_id, request_name, description)
             VALUES ($1, $2, $3, $4)`,
            [user_id, room_id, request_name, description]
        );
        res.status(201).json({ status: "success", message: "Request submitted" });
    } catch (err) {
        console.error("Error creating request:", err.message);
        res.status(500).json({ status: "error", message: "Request failed" });
    }
};
exports.updateRegistration = async (req, res) => {
    const { id } = req.params;
    const { user_id, room_id, request_name, status, description } = req.body;

    try {
        await pool.query(
            `UPDATE RoomRegistration SET user_id=$1, room_id=$2, request_name=$3, status=$4, description=$5 WHERE id=$6`,
            [user_id, room_id, request_name,status , description, id]
        );
        res.json({ status: "success", message: "Registration responded successfully" });
    } catch (err) {
        console.error("Error updating request:", err.message);
        res.status(500).json({ status: "error", message: "Registration respond failed" });
    }
};

exports.getAllRegistrations = async (req, res) => {
    try {
        const result = await pool.query(`SELECT * FROM RoomRegistration`);
        res.json({ status: "success", data: result.rows });
    } catch (err) {
        console.error("Error retrieving registrations:", err.message);
        res.status(500).json({ status: "error", message: "Failed to retrieve registrations" });
    }
}