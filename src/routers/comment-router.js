const express = require('express');
const router = express.Router();
const commentController = require('../controllers/comment-controller');
const asyncHandler = require('../utils/async-handler');
const { auth } = require('../middlewares/verify-token');

router.post('/', auth, asyncHandler(commentController.addComment));
router.get('/boards/:boardId', asyncHandler(commentController.findCommentsByPost));
router.get('/users/:userId/comments', asyncHandler(commentController.findCommentsByUser));
router.patch('/:id', auth, asyncHandler(commentController.modifyComment));
router.delete('/:id', auth, asyncHandler(commentController.removeComment));

module.exports = router;