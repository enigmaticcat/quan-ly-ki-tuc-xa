const router = require('express').Router();
const billRouting = require('../api/Bill/bill');

router.post('/createBill', billRouting.createBill);
router.put('/updateBill/:id', billRouting.updateBill);
router.put('/updateBillStatus/:id', billRouting.updateBillStatus);
router.delete('/deleteBill/:id', billRouting.deleteBill);
router.get('/getAllBills', billRouting.getAllBills);
router.get('/getBillById/:id', billRouting.getBillById);
router.get('/getBillByUserId/:user_id', billRouting.getBillByUserId);
module.exports = router;