const express = require('express');
const router = express.Router();
const userController = require('../controllers/user-controller');
const asyncHandler = require('../utils/async-handler');

router.post('/login', asyncHandler(userController.login));

module.exports = router;