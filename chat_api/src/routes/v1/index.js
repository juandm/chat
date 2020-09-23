const express = require('express');
const authRouter = require('./authRouter');
const userRouter = require('./userRouter');
const chatroomRouter = require('./chatroomRouter');

function loadRoutes(middlewares) {
  const { jwtAuth } = middlewares;
  const v1Router = express.Router();
  v1Router.use('/auth', authRouter);
  v1Router.use('/users', userRouter(jwtAuth));
  v1Router.use('/chatrooms', jwtAuth, chatroomRouter);
  return v1Router;
}

module.exports = loadRoutes;
