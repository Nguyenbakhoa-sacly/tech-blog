
const router = require('express').Router();
const verifyToken = require('../utils/verifyUser');
const postController = require('../controllers/Post.controller')

router.post('/create', verifyToken,
  postController.postCreate)

module.exports = router