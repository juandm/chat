const express = require('express');
const dependecyResolver = require('../../setup/dependencyContainer');

const userController = dependecyResolver.resolve('userController');

const router = express.Router();
router.post('/login', userController.login);

module.exports = router;
