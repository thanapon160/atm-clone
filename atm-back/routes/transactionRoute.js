const express= require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController')
const userController = require('../controllers/userController')

router.get("/history/:id", userController.protect,)
router.post("/withdrawal", userController.protect, transactionController.withdrawal)
router.post("/deposit", userController.protect, transactionController.deposit) 

module.exports = router;