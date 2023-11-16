const express = require('express');
const router = express.Router();
const postController = require('../controllers/post-controller');
const asyncHandler = require('../utils/async-handler');

router.get('/', asyncHandler(postController.findAllPost));
router.post('/', asyncHandler(postController.addPost));
router.patch('/:id', asyncHandler(postController.modifyPost));
router.delete('/:id', asyncHandler(postController.removePost));
router.get('/:author', asyncHandler(postController.findPostByAuthor));
router.get('/categories/:category', asyncHandler(postController.findPostByCategory));

module.exports = router;