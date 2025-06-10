// back-end/routes/notification_routes.js
const router = require("express").Router();
const notificationController = require("../api/Notification/notification");
// const { protect, restrictTo } = require('../api/account'); // TODO: Thêm middleware bảo vệ cho admin routes

// Public route cho sinh viên xem thông báo đã published
router.get("/published", notificationController.getAllPublishedNotifications);

// Admin routes (nên được bảo vệ)
router.post("/create", notificationController.createNotification); //  protect, restrictTo('admin'), 
router.get("/admin/all", notificationController.adminGetAllNotifications); // protect, restrictTo('admin'),
router.put("/admin/update/:id", notificationController.updateNotification); // protect, restrictTo('admin'),
router.delete("/admin/delete/:id", notificationController.deleteNotification); // protect, restrictTo('admin'),

module.exports = router;