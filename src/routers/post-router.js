const express = require('express');
const router = express.Router();
const postController = require('../controllers/post-controller');
const asyncHandler = require('../utils/async-handler');
const { imageToURL } = require('../utils/image-to-url');

router.get('/', asyncHandler(postController.findAllPost));
router.post('/', asyncHandler(postController.addPost));
router.patch('/:id', asyncHandler(postController.modifyPost));
router.delete('/:id', asyncHandler(postController.removePost));
router.get('/:author', asyncHandler(postController.findPostByAuthor));
router.get('/categories/:category', asyncHandler(postController.findPostByCategory));
router.post('/images', asyncHandler(imageToURL));

module.exports = router;