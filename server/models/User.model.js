const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({

  username: {
    type: 'string',
    required: true,
    unique: true,
  },
  email: {
    type: 'string',
    required: true,
    unique: true,
  },
  password: {
    type: 'string',
    required: true,
  },
  profilePicture: {
    type: 'string',
    default: 'https://i0.wp.com/www.stignatius.co.uk/wp-content/uploads/2020/10/default-user-icon.jpg?fit=415%2C415&ssl=1',
  },
  isAdmin: {
    type: Boolean,
    default: false
  }
}, { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);