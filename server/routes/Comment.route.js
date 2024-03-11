const commentControllers = require('../controllers/Comment.controller');
const verifyToken = require('../utils/verifyUser');
const router = require('express').Router();

router.post('/create', verifyToken, commentControllers.createComment);
router.get('/getpostcomments/:postId', commentControllers.getPostComments);
router.put('/likecomment/:commentId', verifyToken, commentControllers.likeComment);
router.put('/editcomment/:commentId', verifyToken, commentControllers.editComment);
router.delete('/deletecomment/:commentId', verifyToken, commentControllers.deleteComment);
module.exports = router