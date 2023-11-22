const express = require('express');
const router = express.Router();
const postController = require('../controllers/post-controller');
const likeController = require('../controllers/like-controller');
const asyncHandler = require('../utils/async-handler');
const { auth } = require('../middlewares/verify-token');

router.get('/popular',postController.getPopularPosts);
router.get('/', asyncHandler(postController.findAllPost));
router.get('/:postId', asyncHandler(postController.findPostById));
router.post('/', auth, asyncHandler(postController.addPost));
router.patch('/:id', auth, asyncHandler(postController.modifyPost));
router.delete('/:id', auth, asyncHandler(postController.removePost));
router.get('/users/:author', asyncHandler(postController.findPostByAuthor));
router.get('/categories/:category', asyncHandler(postController.findPostByCategory));
router.put('/:postId/likes', auth, asyncHandler(likeController.toggleLike));
router.get('/:postId/likes', asyncHandler(likeController.getLikesByPost));

module.exports = router;