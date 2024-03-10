
const User = require('../models/User.model')
const { errorHandler } = require('../utils/error')
const bcrypt = require('bcrypt');
const userController = {

  updateUser: async (req, res, next) => {
    const { username, profilePicture, email, password } = req.body;
    // req.user.userId ('Lấy từ token')
    // req.params.userId ('Lấy tư trình duyệt')
    if (req.user.userId !== req.params.userId) {
      return next(errorHandler(403,
        'You are not allowed to update this user'));
    };
    if (password) {
      if (password.length < 6) {
        return next(errorHandler(400,
          'Password must be at least 6 characters'));
      }
      var hashSyncPassword = bcrypt.hashSync(password, 10);
    };
    if (username) {
      if (username.length < 7 || username.length > 20) {
        return next(errorHandler(400,
          'Username must be at between 7 and 20 characters'));
      };
      if (username.includes(' ')) {
        return next(errorHandler(400,
          'Username cannot contain spaces'));
      }
      if (username !== username.toLowerCase()) {
        return next(errorHandler(400,
          'Username must be lowercase'));
      }
      if (!username.match(/^[a-zA-Z0-9]+$/)) {
        return next(errorHandler(400,
          'Username can only contain letters and numbers'));
      }
    };
    try {
      const updateUser = await User.findByIdAndUpdate(
        req.params.userId, {
        username: username,
        email: email,
        profilePicture: profilePicture,
        password: hashSyncPassword
      }, { new: true, runValidators: true });
      const { password, ...rest } = updateUser._doc;
      res.status(200).json(rest);
    } catch (e) {
      next(e);
    };
  },

  deleteUser: async (req, res, next) => {
    if (!req.user.isAdmin && req.user.userId !== req.params.userId) {
      return next(errorHandler(403,
        'You are not allowed to delete this user'));
    };
    try {
      await User.findByIdAndDelete(req.params.userId);
      res.status(200).json('User has been deleted');
    } catch (e) {
      next(e)
    }
  },

  signOut: async (req, res, next) => {
    try {
      res
        .clearCookie('access_token')
        .status(200)
        .json('User has been signed out')
    } catch (e) {
      next(e);
    }
  },

  getUsers: async (req, res, next) => {
    if (!req.user.isAdmin) {
      return next(errorHandler(403,
        'You are not allowed to see all user'));
    };
    try {
      const startIndex = parseInt(req.query.startIndex) || 0;
      const limit = parseInt(req.query.limit) || 9;
      const sortDirection = req.query.sort || 'asc' ? 1 : -1;
      const users = await User.find()
        .sort({ createAt: sortDirection })
        .skip(startIndex)
        .limit(limit);
      const usersWithoutPassword = users.map((user) => {
        const { password, ...rest } = user._doc;
        return rest
      });
      const totalUsers = await User.countDocuments();
      const now = new Date();
      const onMonthAgo = new Date(
        now.getFullYear(),
        now.getMonth() - 1,
        now.getDate()
      );
      const lastMonthUsers = await User.countDocuments({
        createdAt: { $gte: onMonthAgo },
      });
      res.status(200).json({
        users: usersWithoutPassword,
        totalUsers,
        lastMonthUsers,
      });
    } catch (e) {
      next(e);
    }
  },
  // user comment
  getUser: async (req, res, next) => {
    try {
      const user = await User.findById(req.params.userId);
      if (!user) {
        return next(errorHandler(404, 'User not found!'));
      }
      const { password, ...rest } = user._doc;
      return res.status(200).json(rest);
    } catch (e) {
      next(e);
    }
  }
};

module.exports = userController