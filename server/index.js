const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const userRouter = require('./routers/User.router')

const app = express();

dotenv.config();
app.use(express.json());
app.use(cors());

app.use('/api/v1/user', userRouter)


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