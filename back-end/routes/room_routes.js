const router = require('express').Router();
const e = require('express');
const roomRouting = require('../api/Room/room');

router.post('/create', roomRouting.createRoom);
router.put('/update/:id', roomRouting.updateRoom);
router.delete('/delete/:id', roomRouting.deleteRoom);
router.get('/getAll', roomRouting.getAllRooms);

module.exports = router;