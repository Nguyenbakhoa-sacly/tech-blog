const emailController = require('../controllers/Email.controller');
const router = require('express').Router();

router.post('/sendemail', emailController.sendEmail)

module.exports = router