const { Comment } = require('../db');

const addComment = async (data) => {
    return Comment.create(data);
};

const findCommentsByPost = async (postId) => {
    return Comment.find({ post: postId }).sort({ createdAt: -1 });
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
        { _id: data.id },
        { content },
        { new: true }
    );
};

const removeComment = async (id) => {
    await Comment.findOneAndDelete({ _id: id });

    return;
};

module.exports = {
    addComment,
    findCommentsByPost,
    findCommentById,
    findCommentsByUser,
    modifyComment,
    removeComment,
};