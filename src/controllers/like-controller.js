const likeService = require('../services/like-service');
const postService = require('../services/post-service');

const toggleLike = async (req, res, next) => {
    const { postId } = req.params;
    const userId = req.tokenData.id;

    const existingLike = await likeService.findLikeByUserAndPost(userId, postId);

    if (existingLike) {
        // 이미 좋아요를 눌렀다면 좋아요 취소
        await likeService.removeLike(postId, userId);
        return res.status(200).json({
            message: "좋아요가 취소되었습니다",
            data: null,
        });
    } else {
        const like = await likeService.toggleLike ({
            post: postId,
            user: userId,
        });
        return res.status(201).json({
            message: "좋아요가 추가되었습니다",
            data: { like },
        });
    }
};

const getLikesByPost = async (req, res, next) => {
    const { postId } = req.params;

    const likes = await likeService.getLikesByPost(postId);
    const post = await postService.findPostById(postId);
    return res.status(200).json({
        message: `게시글(${postId})에 대한 좋아요 목록`,
        data: {
            likes,
            post
        },
    });
};

module.exports = {
    toggleLike,
    getLikesByPost,
};