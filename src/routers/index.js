const express = require('express');
const router = express.Router();
const postRouter = require('./post-router');
const userRouter = require('./user-router');

router.use('/api/v1/posts', postRouter);
router.use('/api/v1/users', userRouter);

/* GET home page. */
router.get('/api', function(req, res, next) {
  res.send('hello world!');
});

module.exports = router;