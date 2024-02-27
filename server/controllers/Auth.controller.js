
const User = require('../models/User.model');
const bcrypt = require('bcrypt');
const { errorHandler } = require('../utils/error')
const dotenv = require('dotenv')
const jwt = require('jsonwebtoken');

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
        { userId: validUser._id, isAdmin: validUser.isAdmin },
        process.env.SECRET_KEY
      )
      // không trả ra password
      const { password: pass, ...rest } = validUser._doc;
      return res.status(200)
        .cookie('access_token', token,
          {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
          })
        .json(rest);
    } catch (e) {
      next(e);
    }
  },
  google_signIn: async (req, res, next) => {
    const { name, email, googlePhotoUrl } = req.body;
    try {
      const user = await User.findOne({ email });
      if (user) {
        const token = jwt.sign(
          { id: user._id, isAdmin: user.isAdmin },
          process.env.SECRET_KEY);
        const { password, ...rest } = user._doc;
        return res.status(200).cookie('access_token', token,
          {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
          }).json(rest);
      } else {
        const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
        const hashedPassword = bcrypt.hashSync(generatedPassword, 10);

        const newUser = new User({
          username: name.toLowerCase().split(' ').join('') + Math.random().toString(9).slice(-4),
          email,
          password: hashedPassword,
          profilePicture: googlePhotoUrl
        });

        await newUser.save();
        const token = jwt.sign(
          { id: newUser._id, isAdmin: newUser.isAdmin },
          process.env.SECRET_KEY);
        const { password, ...rest } = newUser._doc;
        return res
          .status(200)
          .cookie('access_token', token,
            {
              httpOnly: true,
              secure: true,
              sameSite: 'strict',
            })
          .json(rest);
      }
    } catch (e) {
      next(e);
    }
  }
}
module.exports = authController;