const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

const app = express();
dotenv.config();
app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
  res.send('Hello World!');
});


mongoose.connect(process.env.MONGOBD_URL)
  .then(() => {
    console.log('Mongodb connection successful');
  });

app.listen(3000, () => {
  console.log('Server listening on port 3000');
});