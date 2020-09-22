const express = require('express');
const dependecyResolver = require('../../setup/dependencyContainer');

const chatroomController = dependecyResolver.resolve('chatroomController');

const router = express.Router();

router.get('/:chatroomId/messages', chatroomController.getMessages);

module.exports = router;
