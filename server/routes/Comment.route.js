const commentControllers = require('../controllers/Comment.controller');
const verifyToken = require('../utils/verifyUser');
const router = require('express').Router();

router.post('/create', verifyToken, commentControllers.createComment);
router.get('/getpostcomments/:postId', commentControllers.getPostComments);
module.exports = router