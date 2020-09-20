const express = require('express');
const userRouter = require('./userRouter');

function loadRoutes() {
  const v1Router = express.Router();
  v1Router.use('/users', userRouter);
  return v1Router;
}

module.exports = loadRoutes;
