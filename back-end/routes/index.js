const router = require("express").Router();
const accountRoute = require("./account_routes");
const roomRoute = require("./room_routes");
// const userRoute = require("./user");

router.use("/account", accountRoute);
router.use("/room", roomRoute)
// router.use("/user", userRoute);

module.exports = router;