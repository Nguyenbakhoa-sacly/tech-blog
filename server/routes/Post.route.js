
const router = require('express').Router();
const verifyToken = require('../utils/verifyUser');
const postController = require('../controllers/Post.controller')

router.post('/create', verifyToken,
  postController.postCreate)
router.get('/getposts', postController.getPosts)
module.exports = router