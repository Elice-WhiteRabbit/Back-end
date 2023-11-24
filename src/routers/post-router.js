const express = require('express');
const router = express.Router();
const postController = require('../controllers/post-controller');
const likeController = require('../controllers/like-controller');
const asyncHandler = require('../utils/async-handler');
const { auth } = require('../middlewares/verify-token');

router.get('/popular',auth, asyncHandler(postController.getPopularPosts));
router.get('/search', postController.searchPost);
router.get('/', auth, asyncHandler(postController.findAllPost));
router.get('/:postId', auth, asyncHandler(postController.findPostById));
router.post('/', auth, asyncHandler(postController.addPost));
router.patch('/:id', auth, asyncHandler(postController.modifyPost));
router.delete('/:id', auth, asyncHandler(postController.removePost));
router.get('/users/:author', auth, asyncHandler(postController.findPostByAuthor));
router.get('/categories/:category', auth, asyncHandler(postController.findPostByCategory));
router.put('/:postId/likes', auth, asyncHandler(likeController.toggleLike));
router.get('/:postId/likes', auth, asyncHandler(likeController.getLikesByPost));

module.exports = router;