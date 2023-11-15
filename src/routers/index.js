const express = require('express');
const router = express.Router();
const postRouter = require('./post-router');

router.use('/api/v1/posts', postRouter);

/* GET home page. */
router.get('/api', function(req, res, next) {
  res.send('hello world!');
});

module.exports = router;
