const express = require('express');
const userRouter = require('./userRouter');
const chatroomRouter = require('./chatroomRouter');

function loadRoutes() {
  const v1Router = express.Router();
  v1Router.use('/users', userRouter);
  v1Router.use('/chatrooms', chatroomRouter);
  return v1Router;
}

module.exports = loadRoutes;
