const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const cors = require('cors');
const userRouter = require('./routes/User.route')
const authRouter = require('./routes/Auth.route')
const app = express();

dotenv.config();
app.use(express.json());
app.use(cors());
app.use(cookieParser());

app.use('/api/v1/user', userRouter);
app.use('/api/v1/auth', authRouter);

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