const express = require('express');
const cors = require('cors');
const userRouter = require('./src/modules/user/userRouter');
const app = express();

app.use(express.json());

app.use(cors());  

app.use('/api/v1/user', userRouter);

module.exports = app;