const express = require('express');
const router = express.Router();
const likeController = require('../controllers/like-controller');
const asyncHandler = require('../utils/async-handler');
const { auth } = require('../middlewares/verify-token');

router.put('/:postId', auth, asyncHandler(likeController.toggleLike));
router.get('/:postId', asyncHandler(likeController.getLikesByPost));

module.exports = router;