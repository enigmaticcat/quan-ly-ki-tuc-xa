// C:\Users\Admin\OneDrive - Hanoi University of Science and Technology\backup\kì 6\Project 2\PRJ\quan-ly-ki-tuc-xa\back-end\routes\form_routes.js
const router = require("express").Router();
const formController = require("../api/Form/form");
const upload = require('../middleware/upload'); // Dùng middleware upload đã có

// Sinh viên tạo đơn từ (có thể có 1 file đính kèm với tên trường là 'attachmentFile')
router.post("/createForm", upload.single('attachmentFile'), formController.createForm);

// Admin lấy tất cả đơn từ
router.get("/getAllForms", formController.getAllForms);

// Lấy chi tiết một đơn từ (cho cả admin và sinh viên xem đơn của mình)
router.get("/getFormById/:id", formController.getFormById);

// Admin cập nhật đơn từ
router.put("/updateForm/:id", formController.updateForm);

// Sinh viên lấy các đơn từ của mình
router.get("/getUserForms/:user_id", formController.getUserForms);


module.exports = router;