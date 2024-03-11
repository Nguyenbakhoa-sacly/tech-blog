const { errorHandler } = require("../utils/error");
const Comment = require('../models/Comment.model');
const { response } = require("express");

const commentControllers = {

  createComment: async (req, res, next) => {
    try {
      const { content, postId, userId } = req.body;
      if (userId !== req.user.userId) {
        return next(errorHandler(403,
          'You are not allowed to create this comment.'))
      };
      const newComment = new Comment({
        content,
        postId,
        userId,
      });
      await newComment.save();
      res.status(200).json(newComment);
    } catch (e) {
      next(e)
    }
  },
  getPostComments: async (req, res, next) => {
    try {
      const comments = await Comment.find({ postId: req.params.postId }).sort({ createdAt: -1 });
      res.status(200).json(comments);
    } catch (e) {
      next(e);
    }
  },
  likeComment: async (req, res, next) => {
    try {
      const comment = await Comment.findById(req.params.commentId);
      if (!comment) {
        return next(errorHandler(404, 'Comment not found!'));
      }
      // kiem tra xem nguoi dung da like comment hay chua
      const userIndex = comment.likes.indexOf(req.user.userId);
      if (userIndex === -1) {
        // neu nguoi dung chua like binh luận thi them 1 like vao 
        comment.numberOfLikes += 1;
        comment.likes.push(req.user.userId);
      } else {
        // nguoi dung da thich binh luận roi, hay xóa hlượt thích
        comment.numberOfLikes -= 1;
        comment.likes.splice(userIndex, 1);
      }
      // luu like
      await comment.save();
      res.status(200).json(comment);
    } catch (e) {
      next(e)
    }
  },
  editComment: async (req, res, next) => {
    try {
      const comment = await Comment.findById(req.params.commentId);
      if (!comment) {
        return next(errorHandler(404, 'Comment not found!'));
      }
      if (comment.userId !== req.user.userId && !req.user.isAdmin) {
        return next(errorHandler(403, 'You are not allowed to edit this comment'));
      }
      const editComment = await Comment.findByIdAndUpdate(req.params.commentId, {
        content: req.body.content,
      }, { new: true, });
      res.status(200).json(editComment);
    } catch (e) {
      next(e);
    }
  },
  deleteComment: async (req, res, next) => {
    try {
      const comment = await Comment.findById(req.params.commentId);
      if (!comment) {
        return next(errorHandler(404, 'Comment not found!'));
      }
      if (comment.userId !== req.user.userId && !req.user.isAdmin) {
        return next(errorHandler(403, 'You are not allowed to edit this comment'));
      }
      await Comment.findByIdAndDelete(req.params.commentId);
      res.status(200).json('Comment has been deleted')
    } catch (e) {
      next(e);
    }
  },
  getComments: async (req, res, next) => {
    try {
      if (!req.user.isAdmin) {
        return next(403, 'You are not allowed to get all comments');
      }
      const startIndex = parseInt(req.query.startIndex) || 0;
      const limit = parseInt(req.query.limit) || 9;
      const sortDirection = req.query.sort === 'desc' ? -1 : 1;
      const comments = await Comment.find()
        .sort({ createdAt: sortDirection })
        .skip(startIndex)
        .limit(limit);
      const totalComments = await Comment.countDocuments();
      const now = new Date();
      const oneMonthAgo = new Date(
        now.getFullYear(),
        now.getMonth() - 1,
        now.getDate()
      );
      const lastMonthCommented = await Comment.countDocuments({ createdAt: { $gte: oneMonthAgo } });
      res.status(200).json(
        {
          comments,
          totalComments,
          lastMonthCommented
        })
    } catch (e) {
      next(e);
    }
  }
}
module.exports = commentControllers;