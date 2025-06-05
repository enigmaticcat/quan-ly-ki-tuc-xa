const express = require('express');
const app = express();
const cors = require("cors");
const pool = require("./database");

const routes = require("./routes"); // Adjust path if needed


app.use(cors());
app.use(express.json());

app.use("/uploads", express.static("uploads"));
// Middleware for parsing multipart/form-data
app.use("/api", routes); // Prefix all routes, e.g., /api/room, /api/bill

//ROUTES

app.listen(5000, () => {
    console.log("Server running at port 5000");
});