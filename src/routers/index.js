const express = require("express");
const router = express.Router();
const postRouter = require("./post-router");
const commentRouter = require("./comment-router");
const userRouter = require("./user-router");
const skillRouter = require("./skill-router");
const userskillRouter = require("./user-skill-router");

router.use("/api/v1/posts", postRouter);
router.use("/api/v1/comments", commentRouter);
router.use("/api/v1/users", userRouter);
router.use("/", skillRouter);
router.use("/", userskillRouter);

/* GET home page. */
router.get("/api", function (req, res, next) {
  res.send("hello world!");
});

module.exports = router;
