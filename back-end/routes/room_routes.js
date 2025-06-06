const router = require('express').Router();
const roomRouting = require('../api/Room/room');
const roomRegistrationRouting = require('../api/Room/roomRegistration');
const upload = require('../middleware/upload');

router.post('/createRoom',upload.single('image'), roomRouting.createRoom);
router.put('/updateRoom/:id',upload.single('image'), roomRouting.updateRoom);
router.delete('/deleteRoom/:id', roomRouting.deleteRoom);
router.get('/getAllRoom', roomRouting.getAllRooms);
router.get('/getRoomById/:id', roomRouting.getRoomById);

router.post('/createRegistration', roomRegistrationRouting.createRegistration);
router.put('/updateRegistration/:id', roomRegistrationRouting.updateRegistration);
router.get('/getAllRegistrations', roomRegistrationRouting.getAllRegistrations);
router.get('/getRegistrationById/:id', roomRegistrationRouting.getRegistrationById);
router.get('/getUserRegistrations/:user_id', roomRegistrationRouting.getUserRegistrations);

module.exports = router;