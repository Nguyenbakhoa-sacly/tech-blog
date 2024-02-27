const Post = require('../models/Post.model')

const postController = {

  postCreate: async (req, res, next) => {
    const { title, content } = req.body;
    if (!req.user.isAdmin) {
      return next(errorHandler(403,
        'You are not allowed to create a post'));
    }
    if (!title || !content) {
      return next(errorHandler(400,
        'Please provide all required fields'));
    }
    const slug = title.split(' ').join('-').toLowerCase().replace(/[^a-zA-Z0-9-]/g, '-');
    const newPost = new Post({
      ...req.body,
      slug,
      userId: req.user.userId,
    })
    try {
      const savePost = await newPost.save();
      res.status(201).json(savePost);
    } catch (e) {
      next(e);
    }
  }
}
module.exports = postController