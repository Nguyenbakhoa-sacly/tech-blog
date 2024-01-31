

const router = require('express').Router();
const authController = require('../controllers/Auth.controller')

router.post('/signup', authController.signUp)

module.exports = router