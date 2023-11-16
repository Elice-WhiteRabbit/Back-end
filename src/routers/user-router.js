const express = require('express');
const router = express.Router();
const userController = require('../controllers/user-controller');
const asyncHandler = require('../utils/async-handler');

router.post('/', asyncHandler(userController.addUser));
router.get('/:id', asyncHandler(userController.findUserById));
router.patch('/:id', asyncHandler(userController.modifyUser));
router.delete('/:id', asyncHandler(userController.removeUser));

module.exports = router;
