const express = require('express');
const router = express.Router();
const userController = require('../controllers/user-controller');
const asyncHandler = require('../utils/async-handler');
const { auth, checkAdmin } = require('../middlewares/verify-token');

router.post('/', asyncHandler(userController.addUser));
router.get('/', auth, asyncHandler(userController.findUserByToken));
router.get('/:id', auth, asyncHandler(userController.findUserById));
router.patch('/:id', auth, asyncHandler(userController.modifyUser));
router.delete('/:id', auth, asyncHandler(userController.removeUser));
router.post('/login', asyncHandler(userController.login));
router.post('/password', asyncHandler(userController.sendCode));
router.post('/password/reset', asyncHandler(userController.resetPassword));


module.exports = router;
