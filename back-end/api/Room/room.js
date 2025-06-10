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
        // Lấy tất cả thông tin cơ bản của phòng và tổng hợp tiện nghi
        const roomResult = await pool.query(`
            SELECT r.*, 
                   COALESCE(array_agg(ra.accommodation) FILTER (WHERE ra.accommodation IS NOT NULL), '{}') AS accommodations
            FROM ROOM r
            LEFT JOIN ROOM_ACCOMMODATION ra ON r.id = ra.room_id
            GROUP BY r.id
            ORDER BY r.building_name, r.room_number ASC -- Sắp xếp cho dễ nhìn
        `);

        if (roomResult.rows.length === 0) {
            return res.json({ status: "success", data: [] });
        }

        // Với mỗi phòng, tính toán số lượng sinh viên đang ở (occupied_slots)
        const roomsWithOccupancy = await Promise.all(roomResult.rows.map(async (room) => {
            const occupancyResult = await pool.query(
                `SELECT COUNT(id) as occupied_count 
                 FROM ROOMREGISTRATION 
                 WHERE room_id = $1 AND status = 'Approved'`, // Chỉ đếm những yêu cầu đã được duyệt
                [room.id]
            );
            const occupied_slots = parseInt(occupancyResult.rows[0].occupied_count, 10) || 0;
            const available_slots = room.capacity - occupied_slots;

            return { 
                ...room, 
                occupied_slots: occupied_slots,
                available_slots: available_slots // Trả về cả số chỗ còn trống
            };
        }));

        res.json({ status: "success", data: roomsWithOccupancy });

    } catch (err) {
        console.error("Lỗi khi lấy tất cả phòng:", err.message, err.stack);
        res.status(500).json({ status: "error", message: "Lỗi server khi lấy danh sách phòng." });
    }
};

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
exports.getStudentsInRoom = async (req, res) => {
    const { roomId } = req.params;
    try {
        // Giả định bạn có bảng ROOMREGISTRATION với status='Approved' cho sinh viên đang ở phòng đó
        // Hoặc nếu bạn có một bảng khác quản lý việc sinh viên nào ở phòng nào (ví dụ: USER_ROOMS)
        const result = await pool.query(
            `SELECT u.id, u.fullname, u.mssv, u.email, u.user_class 
             FROM USERS u
             JOIN ROOMREGISTRATION rr ON u.id = rr.user_id
             WHERE rr.room_id = $1 AND rr.status = 'Approved'`, 
            [roomId]
        );
        // Nếu bạn có bảng USER_ROOMS(user_id, room_id, check_in_date, check_out_date) thì query sẽ khác
        // Ví dụ: SELECT u.* FROM USERS u JOIN USER_ROOMS ur ON u.id = ur.user_id WHERE ur.room_id = $1 AND ur.check_out_date IS NULL

        res.json({ status: "success", data: result.rows });
    } catch (err) {
        console.error(`Lỗi khi lấy danh sách sinh viên trong phòng ${roomId}:`, err.message, err.stack);
        res.status(500).json({ status: "error", message: "Lỗi server khi lấy danh sách sinh viên." });
    }
};
