const express= require('express');
const router = express.Router();
const userController = require('../controllers/userController')

router.get("/me", userController.protect, userController.myAccount)
router.post("/login", userController.login)

module.exports = router;