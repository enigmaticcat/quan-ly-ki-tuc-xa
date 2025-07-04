const router = require("express").Router();
const accountRoute = require("./account_routes");
const roomRoute = require("./room_routes");
const billRoute = require("./bill_routes");
const userRoute = require("./user_routes");
const formRoute = require("./form_routes");
const notificationRoute = require("./notification_routes");
const userNotificationRoute = require("./user_notification_routes.js");
// const userRoute = require("./user");

router.use("/account", accountRoute);
router.use("/room", roomRoute);
router.use("/bill", billRoute);
router.use("/user", userRoute);
router.use("/form", formRoute);
router.use("/notification", notificationRoute);
router.use("/user-notifications", userNotificationRoute);

module.exports = router;