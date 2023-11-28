const express = require('express');
const router = express.Router();
const { imageToURL } = require('../utils/image-to-url');
const postRouter = require('./post-router');
const commentRouter = require('./comment-router');
const userRouter = require('./user-router');
const skillRouter = require('./skill-router');
const generationRouter = require('./generation-router');

router.use('/api/v1/boards', postRouter);
router.use('/api/v1/comments', commentRouter);
router.use('/api/v1/users', userRouter);
router.post('/api/v1/image', imageToURL);
router.use('/api/v1/skills', skillRouter);
router.use('/api/v1/generations', generationRouter);

/* GET home page. */
router.get('/api', function (req, res, next) {
  res.send('hello world!');
});

module.exports = router;