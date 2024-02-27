const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
    unique: true,
  },
  image: {
    type: String,
    default: 'https://buffer.com/cdn-cgi/image/w=7000,fit=contain,q=90,f=auto/library/content/images/2024/01/Best-time-to-post-on-Facebook.png'
  },
  category: {
    type: String,
    default: 'Uncategorized'
  },
  slug: {
    type: String,
    required: true,
    unique: true,
  }
}, { timestamps: true });
module.exports = mongoose.model('Post', postSchema);