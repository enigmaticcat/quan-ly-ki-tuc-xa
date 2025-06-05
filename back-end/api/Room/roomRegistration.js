    const pool = require("../../database");

    exports.createRegistration = async (req, res) => {
        const { user_id, room_id, request_name } = req.body;
        const description = null; // explicitly set to null

        try {
            await pool.query(
                `INSERT INTO ROOMREGISTRATION (user_id, room_id, request_name, description)
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
                `UPDATE ROOMREGISTRATION SET user_id=$1, room_id=$2, request_name=$3, status=$4, description=$5 WHERE id=$6`,
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
            const result = await pool.query(`SELECT * FROM ROOMREGISTRATION`);
            res.json({ status: "success", data: result.rows });
        } catch (err) {
            console.error("Error retrieving registrations:", err.message);
            res.status(500).json({ status: "error", message: "Failed to retrieve registrations" });
        }
    }

    exports.getRegistrationById = async (req, res) => {
        const { id } = req.params;
        try {
            const result = await pool.query(`SELECT * FROM ROOMREGISTRATION WHERE id=$1`, [id]);
            if (result.rows.length === 0) {
                return res.status(404).json({ status: "error", message: "Registration not found" });
            }
            res.json({ status: "success", data: result.rows[0] });
        } catch (err) {
            console.error("Error retrieving registration:", err.message);
            res.status(500).json({ status: "error", message: "Failed to retrieve registration" });
        }
    }

    exports.getUserRegistrations = async (req, res) => {   
        const { user_id } = req.params;
        try {
            const result = await pool.query(`SELECT * FROM ROOMREGISTRATION WHERE user_id=$1`, [user_id]);
            res.json({ status: "success", data: result.rows });
        } catch (err) {
            console.error("Error retrieving user registrations:", err.message);
            res.status(500).json({ status: "error", message: "Failed to retrieve user registrations" });
        }
    }