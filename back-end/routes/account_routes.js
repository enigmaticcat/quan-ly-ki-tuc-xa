// C:\Users\Admin\OneDrive - Hanoi University of Science and Technology\backup\kì 6\Project 2\PRJ\quan-ly-ki-tuc-xa\back-end\routes\user_routes.js
const router = require('express').Router();
const userController = require('../api/User/user');
const upload = require('../middleware/upload'); // IMPORT MIDDLEWARE UPLOAD

// Áp dụng middleware upload.single('tên_trường_file') cho route này
// 'avatar' là tên trường mà frontend sẽ gửi file ảnh lên
router.post('/adminCreateStudent', upload.single('avatar'), userController.adminCreateStudent); 

router.get('/getUserInfo/:id', userController.getUserInfo);
router.put('/updateUserInfo/:id', upload.single('avatar'), userController.updateUserInfo); // Cũng nên thêm cho update
router.get('/getAllUsers', userController.getAllUsers);
router.delete('/deleteUser/:id', userController.deleteUser);

module.exports = router;