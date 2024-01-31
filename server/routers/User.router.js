
const router = require('express').Router();
const userController = require('../controllers/User.controller');

router.get('/test', userController.test);

module.exports = router