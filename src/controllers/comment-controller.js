const commentService = require('../services/comment-service');

const addComment = async (req, res, next) => {
    const { post, content } = req.body;
    const userId = req.tokenData.id;
    
    const createdComment = await commentService.addComment({
        post,
        author: userId,
        content,
    });
    
    res.status(201).json({
        message: "댓글이 생성되었습니다",
        data: createdComment,
    });
};

const findCommentsByPost = async (req, res, next) => {
    const { boardId } = req.params;
    const comments = await commentService.findCommentsByPost(boardId);

    res.status(200).json({
        message: `게시글(${boardId})의 댓글 목록`,
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

const findCommentById = async (req, res, next) => {
    const { commentId } = req.params;

    const comment = await commentService.findCommentById(commentId);

    if (!comment) {
        return res.status(404).json({
            message: "댓글을 찾을 수 없습니다.",
        });
    }

    res.status(200).json({
        message: "댓글 조회 성공",
        data: comment,
    });
};

const modifyComment = async (req, res, next) => {
    const { content } = req.body;
    const { id } = req.params;
    const userId = req.tokenData.id;
    const comment = await commentService.findCommentById(id);

    if (comment.author.toString() !== userId) {
        return res.status(403).json({
            message: "댓글 수정 권한이 없습니다.",
        });
    }
    const updatedComment = await commentService.modifyComment({
        id,
        author: userId,
        content,
    });

    if (!updatedComment) {
        return res.status(404).json({
            message: "댓글을 찾을 수 없습니다",
        });
    }

    res.status(200).json({
        message: "댓글을 수정했습니다",
        data: updatedComment,
    });
};
 
const removeComment = async (req, res, next) => {
    const { id } = req.params;
    const userId = req.tokenData.id;
    const comment = await commentService.findCommentById(id);

    if (!comment || comment.author != userId) {
        return res.status(403).json({
            message: "댓글 삭제 권한이 없습니다.",
        });
    }
    await commentService.removeComment(id, userId);

    res.status(200).json({
        message: "댓글을 삭제했습니다",
    });
};

module.exports = {
    addComment,
    findCommentsByPost,
    findCommentsByUser,
    findCommentById,
    modifyComment,
    removeComment,
};