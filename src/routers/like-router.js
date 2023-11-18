const express = require('express');
const router = express.Router();
const likeController = require('../controllers/like-controller');
const asyncHandler = require('../utils/async-handler');
const { auth } = require('../middlewares/verify-token');

router.post('/:postId', auth, asyncHandler(likeController.addLike));
router.delete('/:postId', auth, asyncHandler(likeController.removeLike));
router.get('/:postId', asyncHandler(likeController.getLikesByPost));

module.exports = router;