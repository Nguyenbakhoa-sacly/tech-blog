
const router = require('express').Router();
const userController = require('../controllers/User.controller');
const verifyToken = require('../utils/verifyUser');

router.put('/update/:userId', verifyToken, userController.updateUser);

module.exports = router