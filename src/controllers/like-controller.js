const likeService = require('../services/like-service');
//const postService = require('../services/post-service');

const toggleLike = async (req, res, next) => {
    const { postId } = req.params;
    const userId = req.tokenData.id;

    const existingLike = await likeService.findLikeByUserAndPost(userId, postId);

    if (existingLike) {
        // 이미 좋아요를 눌렀다면 좋아요 취소
        await likeService.removeLike(postId, userId);
        res.status(200).json({
            message: "좋아요가 취소되었습니다",
            data: null,
        });
    } else {
        const like = await likeService.toggleLike ({
            post: postId,
            user: userId,
        });
        res.status(201).json({
            message: "좋아요가 추가되었습니다",
            data: { like },
        });
    }
};

// const removeLike = async (req, res, next) => {
//     const { postId } = req.params;
//     const userId = req.tokenData.id;

//     const existingLike = await likeService.findLikeByUserAndPost(userId, postId);
//     if (!existingLike) {
//         throw {
//             status: 400,
//             message: "좋아요를 누르지 않은 게시물입니다",
//         };
//     }

//     await likeService.removeLike(postId, userId);
//     res.status(200).json({
//         message: "좋아요가 제거되었습니다",
//         data: null,
//     });
// };

const getLikesByPost = async (req, res, next) => {
    const { postId } = req.params;

    const likes = await likeService.getLikesByPost(postId);

    res.status(200).json({
        message: `게시글(${postId})에 대한 좋아요 목록`,
        data: likes,
    });
};

module.exports = {
    toggleLike,
    getLikesByPost,
};