const postService = require('../services/post-service');
const CommentService = require('../services/comment-service');
const LikeService = require('../services/like-service');
const { Post, Follow } = require('../db');

const postType = {
    BOARD: "BOARD",
    QNA: "QNA",
    STUDY: "STUDY",
    PROJECT: "PROJECT",
    REVIEW: "REVIEW"
};

const expandPost = async (post, currentUserId) => {
    const postDocument = await Post.findById(post._id).populate('author', '_id name profile_url roles');
    const isPopular = post.like_count >= 5;
    const commentCount = await CommentService.getCommentCount(postDocument._id);
    const isFollowing = await Follow.findOne({ from: currentUserId, to: postDocument.author });
    const isLiked = await LikeService.findLikeByUserAndPost(currentUserId, postDocument._id) !== null;

    return {
        ...postDocument._doc,
        isPopular,
        commentCount,
        isFollowing: isFollowing ? true : false,
        followList: isFollowing,
        isLiked: isLiked ? true : false,
    };
};

const getPaginationInfo = (result, page, pageSize) => {
    return {
        page: page ? parseInt(page) : result.page,
        pageSize: pageSize ? parseInt(pageSize) : result.limit,
        totalPosts: result.totalDocs,
        totalPages: result.totalPages,
    };
};

const addPost = async (req, res, next) => {
    const { title, content, category, image_url } = req.body;
    const author = req.tokenData.id;
   
    const postParams = {
        title,
        content,
        category,
        author
    };

    // 이미지 URL이 존재하는 경우에만 추가
    if (image_url) {
        postParams.image_url = image_url;
    }

    const createdPost = await postService.addPost(postParams);
    const populatedPost = await Post.findById(createdPost._id).populate('author', '_id name profile_url roles');

    return res.status(201).json({
        message: "게시글이 등록되었습니다",
        data: populatedPost,
    });
};

const findAllPost = async (req, res, next) => {
    const { page, pageSize, keyword } = req.query;
    const currentUserId = req.tokenData.id;

    let result;

    if (keyword) {
        const searchResult = await postService.searchPost(keyword);
        
        // 페이지네이션
        if (page && pageSize) {
            const paginatedResult = await postService.paginatePosts(searchResult, { page, limit: pageSize, sort: { createdAt: -1 } });
            result = paginatedResult.docs;
        } else {
            result = searchResult;
        }
    } else {
        if (page && pageSize) {
            result = await postService.findAll();
            const paginatedResult = await postService.paginatePosts(result, { page, limit: pageSize, sort: { createdAt: -1 } });
            result = paginatedResult.docs;
            
        } else {
            result = await postService.findAll();
        }
    }
    
    const postsWithCommentCount = await Promise.all(
        result.map(async (post) => {
            return await expandPost(post, currentUserId);
        })
    );

    res.status(200).json({
        message: `${page ? `페이지 ${page}` : '모든'} 게시글 조회`,
        data: {
            posts: postsWithCommentCount,
            pageInfo: getPaginationInfo(result, page, pageSize),
        },
    });
};

const findPostByCategory = async (req, res, next) => {
    const { category } = req.params;
    const { page, pageSize, sortBy, keyword } = req.query;
    const currentUserId = req.tokenData.id;

    if (!postType[category]) {
        throw {
            status: 400,
            message: "게시글 카테고리를 확인해주세요",
        };
    }

    let result; 
    
    if (keyword) {
        const searchResult = await postService.searchPost(keyword);
        const categoryResult = searchResult.filter(post => post.category === category);
        
        result = categoryResult;

    } else {
        result = await postService.findAll( category );
    }

    const postsWithCommentCount = await Promise.all(
        result.map(async (post) => {
            return await expandPost(post, currentUserId);
        })
    );

    let sortedPostsWithCommentCount = postsWithCommentCount;

    if (sortBy === 'comment') {
        sortedPostsWithCommentCount = postsWithCommentCount.sort((a, b) => b.commentCount - a.commentCount);
    }

    result = sortedPostsWithCommentCount;

    if (page && pageSize) {
        const startIndex = (page - 1) * pageSize;
        const endIndex = startIndex + parseInt(pageSize, 10);
        result = sortedPostsWithCommentCount.slice(startIndex, endIndex);
    }

    res.status(200).json({
        message: `${category} 카테고리 ${page ? `${getPaginationInfo(result, page, pageSize).page} 페이지` : `모든`} 게시글 목록`,
        data: {
            posts: result,
            pageInfo: getPaginationInfo(result, page, pageSize),
        },
    });
}

const getPopularPosts = async (req, res, next) => {     
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7); // 일주일 기준
    const currentUserId = req.tokenData.id;
    const { page, pageSize } = req.query;

    let popularPosts = await postService.getPopularPosts(weekAgo);
    const postsWithCommentCount = await Promise.all(
        popularPosts.map(async (post) => {
            return await expandPost(post, currentUserId);
        })
    );

    let paginatedPosts;

    if (page && pageSize) {
        const startIndex = (page - 1) * pageSize;
        const endIndex = startIndex + parseInt(pageSize, 10);
        paginatedPosts = postsWithCommentCount.slice(startIndex, endIndex);
    } else {
        paginatedPosts = postsWithCommentCount;
    }

    res.status(200).json({
        message: "인기 게시글 목록",
        data: {
            posts: paginatedPosts,
            pageInfo: getPaginationInfo(paginatedPosts, page, pageSize),
        },
    });
};

const findPostByAuthor = async (req, res, next) => {
    const { author } = req.params;
    const currentUserId = req.tokenData.id;

    let post = await postService.findPostByAuthor(author);
    const postsWithCommentCount = await Promise.all(
        post.map(async (post) => {
            post = await Post.findById(post._id).populate('author', '_id name profile_url roles');
            const commentCount = await CommentService.getCommentCount(post._id);
            const isPopular = post.like_count >= 5;
            const isFollowing = await Follow.findOne({ from: currentUserId, to: post.author });
            const isLiked = await LikeService.findLikeByUserAndPost(currentUserId, post._id) !== null;
            return { 
                post, 
                isPopular, 
                commentCount, 
                isFollowing: isFollowing? true : false,
                followList: isFollowing,
                isLiked: isLiked? true : false,
            };
        })
    );

    res.status(200).json({
        message: `${author}가 작성한 글 목록`,
        data: postsWithCommentCount
    });
};

const findPostById = async (req, res, next) => {
    const { postId } = req.params;
    const currentUserId = req.tokenData.id;
    let post = await postService.findPostById(postId);

    if (!post) {
        return res.status(404).json({
            message: "게시글을 찾을 수 없습니다",
        });
    }
    post = await Post.findById(post._id).populate('author', '_id name profile_url roles');
    const commentCount = await CommentService.getCommentCount(postId);
    const isPopular = post.like_count >= 5;
    const isFollowing = await Follow.findOne({ from: currentUserId, to: post.author });
    const isLiked = await LikeService.findLikeByUserAndPost(currentUserId, post._id) !== null;
    res.status(200).json({
        message: "게시글 조회 성공",
        data: {
            post,
            isPopular,
            commentCount,
            isFollowing: isFollowing? true : false,
            followList: isFollowing,
            isLiked: isLiked? true : false,
        }
    });
};

const modifyPost = async (req, res, next) => {
    const { title, content, category, image_url } = req.body;
    const { id } = req.params;
    const userId = req.tokenData.id;
    const post = await postService.findPostById(id);

    if ((post.author != userId) && (req.tokenData.roles !== "ADMIN")) {
        return res.status(403).json({
            message: "게시글 수정 권한이 없습니다",
        });
    }
    
    const updatedPost = await postService.modifyPost({
        id, 
        title, 
        content, 
        category,
        image_url
    });
    const populatedPost = await Post.findById(updatedPost._id).populate('author', '_id name profile_url roles');
    const commentCount = await CommentService.getCommentCount(id);
    const isPopular = post.like_count >= 5;
    
    res.status(200).json({
        message: "게시글을 수정했습니다",
        data: { ...populatedPost._doc, isPopular, commentCount },
    });
};

const removePost = async (req, res, next) => {
    const { id } = req.params;
    const userId = req.tokenData.id;
    const post = await postService.findPostById(id);

    if (!post || (post.author != userId) && (req.tokenData.roles !== "ADMIN")) {
        return res.status(403).json({
            message: "게시글 삭제 권한이 없습니다",
        });
    }
    await postService.removePost(id);
    res.status(200).json({
        message: "게시글을 삭제했습니다"
    });
};

module.exports = {
    addPost,
    modifyPost,
    findAllPost,
    findPostById,
    findPostByCategory,
    findPostByAuthor,
    removePost,
    getPopularPosts,
}