const express = require('express');
const app = express();
const cors = require("cors");
const pool = require("./database");
const accountRouter = require("./routes/account_routes"); 


app.use(cors());
app.use(express.json());
app.use("/account", accountRouter); 


//ROUTES

app.listen(5000, () => {
    console.log("Server running at port 5000");
});