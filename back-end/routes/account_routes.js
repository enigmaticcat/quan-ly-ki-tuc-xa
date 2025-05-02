const router = require("express").Router();
const accountRouting = require("../api/account");

router.post("/login", accountRouting.login);
router.post("/register", accountRouting.register);
router.post("/forgot-password", accountRouting.forgotPassword);
router.post("/reset-password-confirmation", accountRouting.verifyResetPasswordToken);
router.post("/reset-password", accountRouting.resetPassword);
module.exports = router;