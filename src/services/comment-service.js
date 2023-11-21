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

const modifyComment = async (data) => {
    const { content } = data;

    return Comment.findOneAndUpdate(
        { _id: data.id, author: data.author },
        { content },
        { new: true }
    );
};

const removeComment = async (id, author) => {
    await Comment.findOneAndDelete({ _id: id, author });

    return;
};

module.exports = {
    addComment,
    findCommentsByPost,
    findCommentsByUser,
    modifyComment,
    removeComment,
};