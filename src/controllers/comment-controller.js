const commentService = require('../services/comment-service');
const { Comment, Post, User } = require('../db'); 

const userRoleType = {
    USER: "USER",
    COACH: "COACH",
    ADMIN: "ADMIN"
};

const postType = {
    BOARD: "BOARD",
    QNA: "QNA",
    STUDY: "STUDY",
    PROJECT: "PROJECT",
    REVIEW: "REVIEW"
};

const addComment = async (req, res, next) => {
    const { post, content } = req.body;
    const userId = req.tokenData.id;
    const targetPost = await Post.findById(post);

    if (targetPost.category === postType.QNA) {
        const user = await User.findById(userId);

        if (!user || user.roles != userRoleType.COACH) {
            return res.status(403).json({
                message: "QNA 게시판은 코치님만 답변할 수 있습니다",
            });
        }
    }

    const createdComment = await commentService.addComment({
        post,
        author: userId,
        content,
    });

    const populatedComment = await Comment.findById(createdComment._id).populate('author', '_id name profile_url roles');
    
    res.status(201).json({
        message: "댓글이 생성되었습니다",
        data: populatedComment,
    });
};

const findCommentsByPost = async (req, res, next) => {
    const { boardId } = req.params;
    const originComments = await commentService.findCommentsByPost(boardId);
    const poplateComents = await Comment.populate(originComments, { path: 'author', select: '_id name profile_url roles' });

    res.status(200).json({
        message: `게시글(${boardId})의 댓글 목록`,
        data: poplateComents,
    });
};

const findCommentsByUser = async (req, res, next) => {
    const { userId } = req.params;

    const originComments = await commentService.findCommentsByUser(userId);
    const poplateComents = await Comment.populate(originComments, { path: 'author', select: '_id name profile_url roles' });

    res.status(200).json({
        message: `유저(${userId})의 댓글 목록`,
        data: poplateComents,
    });
};

const findCommentById = async (req, res, next) => {
    const { id } = req.params;
    const originComments = await commentService.findCommentById(id);
    
    if (!originComments) {
        return res.status(404).json({
            message: "댓글을 찾을 수 없습니다",
        });
    }

    const poplateComents = await Comment.populate(originComments, { path: 'author', select: '_id name profile_url roles' });

    res.status(200).json({
        message: "댓글 조회 성공",
        data: poplateComents,
    });
};

const modifyComment = async (req, res, next) => {
    const { content } = req.body;
    const { id } = req.params;
    const userId = req.tokenData.id;
    const comment = await commentService.findCommentById(id);

    if ((comment.author != userId) && (req.tokenData.roles !== userRoleType.ADMIN)) {
        return res.status(403).json({
            message: "댓글 수정 권한이 없습니다",
        });
    }
    const updatedComment = await commentService.modifyComment({
        id,
        author: comment.author,
        content,
    });

    if (!updatedComment) {
        return res.status(404).json({
            message: "댓글을 찾을 수 없습니다",
        });
    }

    const populatedComment = await Comment.findById(updatedComment._id).populate('author', '_id name profile_url roles');

    res.status(200).json({
        message: "댓글을 수정했습니다",
        data: populatedComment,
    });
};
 
const removeComment = async (req, res, next) => {
    const { id } = req.params;
    const userId = req.tokenData.id;
    const comment = await commentService.findCommentById(id);

    if ((comment.author != userId) && (req.tokenData.roles !== userRoleType.ADMIN)) {
        return res.status(403).json({
            message: "댓글 삭제 권한이 없습니다",
        });
    }
    await commentService.removeComment(id);

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