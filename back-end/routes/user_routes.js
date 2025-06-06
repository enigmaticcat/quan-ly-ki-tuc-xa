// C:\Users\Admin\OneDrive - Hanoi University of Science and Technology\backup\kì 6\Project 2\PRJ\quan-ly-ki-tuc-xa\back-end\routes\user_routes.js
const router = require('express').Router();
const userController = require('../api/User/user');
const upload = require('../middleware/upload');

router.post('/adminCreateStudent', upload.single('avatar'), userController.adminCreateStudent); 
router.get('/getUserInfo/:id', userController.getUserInfo);
// ÁP DỤNG MIDDLEWARE UPLOAD CHO UPDATEUSERINFO
router.put('/updateUserInfo/:id', upload.single('avatar'), userController.updateUserInfo); 
router.get('/getAllUsers', userController.getAllUsers);
router.delete('/deleteUser/:id', userController.deleteUser);

module.exports = router;