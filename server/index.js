const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const cors = require('cors');
const userRoutes = require('./routes/User.route')
const authRoutes = require('./routes/Auth.route')
const postRoutes = require('./routes/Post.route')
const app = express();

dotenv.config();
app.use(cookieParser());
app.use(express.json());
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
  optionsSuccessStatus: 200,
}));

app.use('/api/v1/user', userRoutes);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/post', postRoutes);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  res.status(statusCode).json({
    success: false,
    statusCode,
    message
  })
})

mongoose.connect(process.env.MONGOBD_URL)
  .then(() => {
    console.log('Mongodb connection successful');
  })
  .catch(() => {
    console.log('Mongodb connection error');
  });

app.listen(3000, () => {
  console.log('Server listening on port 3000');
});