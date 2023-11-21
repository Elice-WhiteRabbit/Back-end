const express = require('express');
const router = express.Router();
const postController = require('../controllers/post-controller');
const likeController = require('../controllers/like-controller');
const asyncHandler = require('../utils/async-handler');
const { auth } = require('../middlewares/verify-token');

router.get('/', asyncHandler(postController.findAllPost));
router.post('/', asyncHandler(postController.addPost));
router.patch('/:id', asyncHandler(postController.modifyPost));
router.delete('/:id', asyncHandler(postController.removePost));
router.get('/:author', asyncHandler(postController.findPostByAuthor));
router.get('/categories/:category', asyncHandler(postController.findPostByCategory));
router.put('/:boardId/likes', auth, asyncHandler(likeController.toggleLike));
router.get('/:boardId/likes', asyncHandler(likeController.getLikesByPost));

module.exports = router;