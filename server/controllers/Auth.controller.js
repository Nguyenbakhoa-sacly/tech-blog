
const User = require('../models/User.model');
const bcrypt = require('bcrypt');
const { errorHandler } = require('../utils/error')
const authController = {

  signUp: async (req, res, next) => {
    const { username, password, email } = req.body;
    if (!username || !password || !email ||
      email === '' || username === '' || password === '') {
      next(errorHandler(400, ' All fields are required'));
    }

    const hashPassword = bcrypt.hashSync(password, 10)
    const newUser = new User({
      email: email,
      username: username,
      password: hashPassword,
    })
    try {
      await newUser.save();
      return res.status(200).json({
        message: 'SignUp successfully!'
      })
    } catch (e) {
      next(e);
    }
  }
}
module.exports = authController;