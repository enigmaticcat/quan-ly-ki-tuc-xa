// back-end/routes/user_notification_routes.js
const router = require("express").Router();
const userNotifController = require("../api/UserNotification/userNotification");
// const { protect } = require('../api/account'); // TODO: Nên bảo vệ các API này

// Lấy thông báo chưa đọc của user (user_id lấy từ params hoặc từ token)
router.get("/unread/:userId", userNotifController.getUnreadUserNotifications); // protect, 
router.put("/mark-read/:notificationId", userNotifController.markNotificationAsRead); // protect,
router.put("/mark-all-read/:userId", userNotifController.markAllNotificationsAsRead); // protect, 

module.exports = router;