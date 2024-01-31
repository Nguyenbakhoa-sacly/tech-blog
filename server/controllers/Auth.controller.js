
const User = require('../models/User.model');
const bcrypt = require('bcrypt');

const authController = {

  signUp: async (req, res) => {
    const { username, password, email } = req.body;
    if (!username || !password || !email ||
      email === '' || username === '' || password === '') {
      return res.status(400).json(
        { message: 'Invalid email, username or password provided in request' })
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
        message: 'User saved successfully!'
      })
    } catch (e) {
      return res.status(500).json({ message: e.message })
    }
  }
}
module.exports = authController;