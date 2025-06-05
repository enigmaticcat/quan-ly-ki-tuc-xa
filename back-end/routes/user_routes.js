const router = require('express').Router();
const userRouting = require('../api/User/user');


router.get('/getUserInfo/:id', userRouting.getUserInfo);
router.put('/updateUserInfo/:id', userRouting.updateUserInfo);
router.get('/getAllUserInfo', userRouting.getAllUsers);
router.delete('/deleteUser/:id', userRouting.deleteUser);
module.exports = router;