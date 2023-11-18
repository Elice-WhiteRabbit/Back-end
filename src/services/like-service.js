const { Like } = require('../db');
const { Post } = require('../db');

const addLike = async (data) => {
    const existingLike = await Like.findOne({ post: data.post, user: data.user });

    if (existingLike) {
        // 이미 좋아요를 눌렀다면 좋아요 취소
        await Like.findOneAndDelete({ post: data.post, user: data.user });
        await updatePostLikeCount(data.post, -1); 
        return null; 
    }
    await updatePostLikeCount(data.post, 1); 
    return Like.create(data);
};

const removeLike = async (postId, userId) => {
    const existingLike = await Like.findOne({ post: postId, user: userId });

    if (existingLike) {
        await Like.findOneAndDelete({ post: postId, user: userId });
        await updatePostLikeCount(postId, -1); 
    }
};
const updatePostLikeCount = async (postId, increment) => {
    await Post.findByIdAndUpdate(postId, { $inc: { like_count: increment } });
};

const getLikesByPost = async (postId) => {
    return Like.find({ post: postId }); 
};

const findLikeByUserAndPost = async (userId, postId) => {
    return Like.findOne({ user: userId, post: postId });
};


module.exports = {
    addLike,
    removeLike,
    getLikesByPost,
    findLikeByUserAndPost,
};