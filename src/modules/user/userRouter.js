const express = require('express');
const createUser = require('./userController');
const userRouter = express.Router();

userRouter.post('/register', createUser);

module.exports = userRouter;