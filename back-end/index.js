// C:\Users\Admin\OneDrive - Hanoi University of Science and Technology\backup\kì 6\Project 2\PRJ\quan-ly-ki-tuc-xa\back-end\index.js

require('dotenv').config(); // << THÊM DÒNG NÀY VÀO ĐẦU TIÊN

const express = require('express');
const app = express();
const cors = require("cors");
// const pool = require("./database"); // Không cần thiết ở đây nếu routes đã import

const routes = require("./routes"); 

app.use(cors());
app.use(express.json());

app.use("/uploads", express.static("uploads"));
app.use("/api", routes);

// Sử dụng PORT từ .env nếu có, ngược lại dùng 5000
const PORT = process.env.PORT || 5000; 

app.listen(PORT, () => {
    console.log(`Server running at port ${PORT}`);
});