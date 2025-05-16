const pool = require("../../database");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
const crypto = require("crypto");

exports.createRoom = async (req, res) => {
    const { room_number, building_name, gender, capacity, floor, accommodations } = req.body;
    try {
        await pool.query(
            `INSERT INTO ROOM (room_number, building_name, gender, capacity, floor, accommodations)
             VALUES ($1, $2, $3, $4, $5, $6)`,
            [room_number, building_name, gender, capacity, floor, accommodations]
        );
        res.status(201).json({ status: "success", message: "Room created successfully" });
    } catch (err) {
        console.error("Create Room Error:", err.message);
        res.status(500).json({ status: "error", message: "Room creation failed" });
    }
};

exports.updateRoom = async (req, res) => {
    const { id } = req.params;
    const { room_number, building_name, gender, capacity, floor, accommodations } = req.body;
    try {
        await pool.query(
            `UPDATE ROOM SET room_number=$1, building_name=$2, gender=$3,
             capacity=$4, floor=$5, accommodations=$6 WHERE id=$7`,
            [room_number, building_name, gender, capacity, floor, accommodations, id]
        );
        res.json({ status: "success", message: "Room updated successfully" });
    } catch (err) {
        console.error("Update Room Error:", err.message);
        res.status(500).json({ status: "error", message: "Room update failed" });
    }
};
exports.deleteRoom = async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query(`DELETE FROM ROOM WHERE id=$1`, [id]);
        res.json({ status: "success", message: "Room deleted successfully" });
    } catch (err) {
        console.error("Delete Room Error:", err.message);
        res.status(500).json({ status: "error", message: "Room deletion failed" });
    }
};
exports.getAllRooms = async (req, res) => {
    try {
        const result = await pool.query(`SELECT * FROM ROOM`);
        res.json({ status: "success", data: result.rows });
    } catch (err) {
        console.error("Get All Rooms Error:", err.message);
        res.status(500).json({ status: "error", message: "Failed to retrieve rooms" });
    }
}

exports.getRoomById = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query(`SELECT * FROM ROOM WHERE id=$1`, [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ status: "error", message: "Room not found" });
        }
        res.json({ status: "success", data: result.rows[0] });
    } catch (err) {
        console.error("Get Room By ID Error:", err.message);
        res.status(500).json({ status: "error", message: "Failed to retrieve room" });
    }
}