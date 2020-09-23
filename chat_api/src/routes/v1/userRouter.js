const express = require('express');
const dependecyResolver = require('../../setup/dependencyContainer');

const userController = dependecyResolver.resolve('userController');

function loadUserRoutes(authMiddleware) {
  const router = express.Router();
  router.post('/', userController.createUser);
  router.get('/:userId/chatrooms', authMiddleware, userController.getUserChatrooms);
  return router;
}

module.exports = loadUserRoutes;
