const express = require('express');
const router = express.Router();
const postController = require('../controllers/post-controller');
const asyncHandler = require('../utils/async-handler');

router.get('/', asyncHandler(postController.getAllPost));
router.post('/', asyncHandler(postController.addPost));
router.patch('/:id', asyncHandler(postController.setPost));
router.delete('/:id', asyncHandler(postController.deletePost));
router.get('/:author', asyncHandler(postController.getPostByAuthor));
router.get('/categories/:category', asyncHandler(postController.getPostByCategory));

module.exports = router;