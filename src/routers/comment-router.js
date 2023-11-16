const express = require('express');
const router = express.Router();
const commentController = require('../controllers/comment-controller');
const asyncHandler = require('../utils/async-handler');

router.post('/', asyncHandler(commentController.addComment));
router.get('/post/:postId', asyncHandler(commentController.findCommentsByPost));
router.get('/user/:userId', asyncHandler(commentController.findCommentsByUser)); 
router.patch('/:id', asyncHandler(commentController.modifyComment));
router.delete('/:id', asyncHandler(commentController.removeComment));

module.exports = router;