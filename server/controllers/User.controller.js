
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
  }
};

module.exports = userController