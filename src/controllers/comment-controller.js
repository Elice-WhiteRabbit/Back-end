const commentService = require('../services/comment-service');

const addComment = async (req, res, next) => {
    const { post, author, content } = req.body;

    const createdComment = await commentService.addComment({
        post,
        author,
        content,
    });

    res.status(201).json({
        message: "댓글이 생성되었습니다",
        data: createdComment,
    });
};

const findCommentsByPost = async (req, res, next) => {
    const { postId } = req.params;

    const comments = await commentService.findCommentsByPost(postId);

    res.status(200).json({
        message: `게시글(${postId})의 댓글 목록`,
        data: comments,
    });
};

const findCommentsByUser = async (req, res, next) => {
    const { userId } = req.params;

    const comments = await commentService.findCommentsByUser(userId);

    res.status(200).json({
        message: `유저(${userId})의 댓글 목록`,
        data: comments,
    });
};

const modifyComment = async (req, res, next) => {
    const { content } = req.body;
    const { id } = req.params;

    const updatedComment = await commentService.modifyComment({
        id,
        content,
    });

    res.status(200).json({
        message: "댓글을 수정했습니다",
        data: updatedComment,
    });
};

const removeComment = async (req, res, next) => {
    const { id } = req.params;

    await commentService.removeComment(id);

    res.status(200).json({
        message: "댓글을 삭제했습니다",
    });
};

module.exports = {
    addComment,
    findCommentsByPost,
    findCommentsByUser,
    modifyComment,
    removeComment,
};