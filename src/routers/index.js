const express = require('express');
const router = express.Router();
const postRouter = require('./postRouter');

router.use('/api/v1/posts', postRouter);

/* GET home page. */
router.get('/', function(req, res, next) {
  res.send('ok');
});

module.exports = router;
