const { Comment } = require('../db');

const getCommentCount = async (boardId) => {
    const commentCount = await Comment.countDocuments({ post: boardId });
    return commentCount;
};

const addComment = async (data) => {
    return Comment.create(data);
};

const findCommentsByPost = async (boardId) => {
    return Comment.find({ post: boardId }).sort({ createdAt: -1 });
};

const findCommentsByUser = async (userId) => {
    return Comment.find({ author: userId }).sort({ createdAt: -1 });
};

const findCommentById = async (id) => {
    return Comment.findById(id);
};

const modifyComment = async (data) => {
    const { content } = data;

    return Comment.findOneAndUpdate(
        { _id: data.id, author: data.author },
        { content },
        { new: true }
    );
};

const removeComment = async (id) => {
    await Comment.findByIdAndDelete(id);
    return;
};

module.exports = {
    addComment,
    findCommentsByPost,
    findCommentsByUser,
    findCommentById,
    modifyComment,
    removeComment,
    getCommentCount
};