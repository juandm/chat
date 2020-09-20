const router = require('express').Router();
const dependecyResolver = require('../../setup/dependencyContainer');

const userController = dependecyResolver.resolve('userController');

router.post('/', userController.createUser);

module.exports = router;
