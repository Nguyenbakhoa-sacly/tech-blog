
const User = require('../models/User.model')

const userController = {

  test: async (req, res) => {
    try {
      const users = await User.find();
      res.status(200).json(users);
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  },

}

module.exports = userController