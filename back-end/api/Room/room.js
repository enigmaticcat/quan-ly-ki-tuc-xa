const pool = require("../../database");

exports.createRoom = async (req, res) => {
    const { room_number, building_name, gender, capacity, floor, accommodations } = req.body;
    const image = req.file ? req.file.filename : null;

    try {
        // Insert room (without accommodations)
        const result = await pool.query(
            `INSERT INTO ROOM (room_number, building_name, gender, capacity, floor, image)
             VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
            [room_number, building_name, gender, capacity, floor, image]
        );

        const roomId = result.rows[0].id;

        // Insert accommodations into ROOM_ACCOMMODATION
        if (Array.isArray(accommodations) && accommodations.length > 0) {
            const insertPromises = accommodations.map(acc =>
                pool.query(
                    `INSERT INTO ROOM_ACCOMMODATION (room_id, accommodation) VALUES ($1, $2)`,
                    [roomId, acc]
                )
            );
            await Promise.all(insertPromises);
        }

        res.status(201).json({ status: "success", message: "Room created successfully", roomId });
    } catch (err) {
        console.error("Create Room Error:", err.message);
        res.status(500).json({ status: "error", message: "Room creation failed" });
    }
};

exports.updateRoom = async (req, res) => {
    const { id } = req.params;
    const { room_number, building_name, gender, capacity, floor, accommodations } = req.body;
    const image = req.file ? req.file.filename : null;

    try {
        if (image) {
            await pool.query(
                `UPDATE ROOM SET room_number=$1, building_name=$2, gender=$3,
                 capacity=$4, floor=$5, image=$6 WHERE id=$7`,
                [room_number, building_name, gender, capacity, floor, image, id]
            );
        } else {
            await pool.query(
                `UPDATE ROOM SET room_number=$1, building_name=$2, gender=$3,
                 capacity=$4, floor=$5 WHERE id=$6`,
                [room_number, building_name, gender, capacity, floor, id]
            );
        }

        // Delete old accommodations
        await pool.query(`DELETE FROM ROOM_ACCOMMODATION WHERE room_id=$1`, [id]);

        // Insert new accommodations
        if (Array.isArray(accommodations) && accommodations.length > 0) {
            const insertPromises = accommodations.map(acc =>
                pool.query(
                    `INSERT INTO ROOM_ACCOMMODATION (room_id, accommodation) VALUES ($1, $2)`,
                    [id, acc]
                )
            );
            await Promise.all(insertPromises);
        }

        res.json({ status: "success", message: "Room updated successfully" });
    } catch (err) {
        console.error("Update Room Error:", err.message);
        res.status(500).json({ status: "error", message: "Room update failed" });
    }
};

exports.deleteRoom = async (req, res) => {
    const { id } = req.params;
    try {
        // Because of ON DELETE CASCADE, ROOM_ACCOMMODATION rows are auto-deleted
        await pool.query(`DELETE FROM ROOM WHERE id=$1`, [id]);
        res.json({ status: "success", message: "Room deleted successfully" });
    } catch (err) {
        console.error("Delete Room Error:", err.message);
        res.status(500).json({ status: "error", message: "Room deletion failed" });
    }
};

exports.getAllRooms = async (req, res) => {
    try {
        // Fetch rooms with accommodations as array aggregated
        const result = await pool.query(`
            SELECT r.*, 
                   COALESCE(array_agg(ra.accommodation) FILTER (WHERE ra.accommodation IS NOT NULL), '{}') AS accommodations
            FROM ROOM r
            LEFT JOIN ROOM_ACCOMMODATION ra ON r.id = ra.room_id
            GROUP BY r.id
        `);
        res.json({ status: "success", data: result.rows });
    } catch (err) {
        console.error("Get All Rooms Error:", err.message);
        res.status(500).json({ status: "error", message: "Failed to retrieve rooms" });
    }
}

exports.getRoomById = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query(`
            SELECT r.*, 
                   COALESCE(array_agg(ra.accommodation) FILTER (WHERE ra.accommodation IS NOT NULL), '{}') AS accommodations
            FROM ROOM r
            LEFT JOIN ROOM_ACCOMMODATION ra ON r.id = ra.room_id
            WHERE r.id = $1
            GROUP BY r.id
        `, [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ status: "error", message: "Room not found" });
        }
        res.json({ status: "success", data: result.rows[0] });
    } catch (err) {
        console.error("Get Room By ID Error:", err.message);
        res.status(500).json({ status: "error", message: "Failed to retrieve room" });
    }
}
