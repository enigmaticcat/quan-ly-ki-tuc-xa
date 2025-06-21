// C:\Users\Admin\OneDrive - Hanoi University of Science and Technology\backup\kì 6\Project 2\PRJ\quan-ly-ki-tuc-xa\back-end\routes\account_routes.js
const router = require("express").Router();
const accountRouting = require("../api/account"); // Đảm bảo đường dẫn này đúng

// Routes liên quan đến tài khoản (đăng nhập, đăng ký, quên mật khẩu...)
router.post("/login", accountRouting.login); // << ROUTE ĐĂNG NHẬP CHO ADMIN VÀ USER
router.post("/register", accountRouting.register); // ROUTE ĐĂNG KÝ
router.post("/forgot-password", accountRouting.forgotPassword);
router.post("/reset-password-confirmation", accountRouting.verifyResetPasswordToken);
router.post("/reset-password", accountRouting.resetPassword);

module.exports = router;