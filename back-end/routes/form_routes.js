const express = require('express');
const router = express.Router();
const formRouting = require('../api/Forms/form'); // path to your form.js
const upload = require('../middleware/upload'); // path to your upload.js

router.post('/createForm/:user_id', upload.array('attachments', 10), formRouting.createForm );
router.put('/updateForm/:id', formRouting.updateFormById);
router.get('/getAllForms', formRouting.getAllForms);

module.exports = router;