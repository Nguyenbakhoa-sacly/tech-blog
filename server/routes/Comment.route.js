const commentControllers = require('../controllers/Comment.controller');
const verifyToken = require('../utils/verifyUser');
const router = require('express').Router();

router.post('/create', verifyToken, commentControllers.createComment)
module.exports = router