
const User = require('../models/User.model');
const bcrypt = require('bcrypt');
const { errorHandler } = require('../utils/error')
const dotenv = require('dotenv')
const jwt = require('jsonwebtoken');
// 2:47:56
dotenv.config();

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
  },

  signIn: async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password || email === '' || password === '') {
      next(errorHandler(400, ' All fields are required'));
    }
    try {
      const validUser = await User.findOne({ email: email });
      if (!validUser) {
        return next(errorHandler(400, 'User not found!'));
      }
      const validPassword = bcrypt.compareSync(password, validUser.password);
      if (!validPassword) {
        return next(errorHandler(400, 'Invalid password'));
      }
      const token = jwt.sign(
        { userId: validUser._id, username: validUser.username },
        process.env.SECRET_KEY
      )
      // không trả ra password
      const { password: pass, ...rest } = validUser._doc;
      return res.status(200).cookie('access_token', token,
        { httpOnly: true }).json(rest);
    } catch (e) {
      next(e);
    }
  }
}
module.exports = authController;