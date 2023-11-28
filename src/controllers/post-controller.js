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

    // 이미지 URL이 존재하는 경우 이미지 추가
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
    let { page, pageSize, keyword } = req.query;
    const currentUserId = req.tokenData.id;

    let result;

    if (keyword) {
        // 검색 키워드가 있는 경우
        const searchResult = await postService.searchPost(keyword);
        
        // 페이지네이션
        if (page && pageSize) {
            result = await postService.paginatePosts(searchResult, { page, limit: pageSize, sort: { createdAt: -1 } });
            result = result.docs;
        } else {
            result = searchResult;
        }
    } else {
        // 검색 키워드가 없는 경우 
        if (page && pageSize) {
            result = await postService.paginatePosts({}, { page, limit: pageSize, sort: { createdAt: -1 } });
            result = result.docs;
        } else {
            result = await postService.findAll();
        }
    }

    const postsWithCommentCount = await Promise.all(
        result.map(async (post) => {
            post = await Post.findById(post._id).populate('author', '_id name profile_url roles');
            const commentCount = await CommentService.getCommentCount(post._id);
            const isPopular = post.like_count >= 5;
            const isFollowing = await Follow.findOne({ from: currentUserId, to: post.author });
            const isLiked = await LikeService.findLikeByUserAndPost(currentUserId, post._id) !== null;
            return {
                ...post._doc,
                isPopular,
                commentCount,
                isFollowing: isFollowing ? true : false,
                followList: isFollowing,
                isLiked: isLiked ? true : false,
            };
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
    let paginatedResult;
    if (keyword) {
        // 검색 키워드가 있는 경우
        const searchResult = await postService.searchPost(keyword);
       
        // 해당 카테고리의 글만 조회
        const categoryResult = searchResult.filter(post => post.category === category);
        
        // 페이지네이션
        if (page && pageSize) {
            paginatedResult = await postService.paginatePosts(categoryResult, { page, limit: pageSize });
            result = paginatedResult.docs;
        } else {
            result = categoryResult;
        }
    } else {
        // 검색 키워드가 없는 경우 
        if (page && pageSize) {
            result = await postService.findPostByCategory(category, page, pageSize);
            result = result.docs;
        } else {
            result = await postService.findAll( category );
        }
    }

    const postsWithCommentCount = await Promise.all(
        result.map(async (post) => {
            post = await Post.findById(post._id).populate('author', '_id name profile_url roles');
            const commentCount = await CommentService.getCommentCount(post._id);
            const isPopular = post.like_count >= 5;
            const isFollowing = await Follow.findOne({ from: currentUserId, to: post.author });
            const isLiked = await LikeService.findLikeByUserAndPost(currentUserId, post._id) !== null;
            return {
                ...post._doc,
                isPopular,
                commentCount,
                isFollowing: isFollowing ? true : false,
                followList: isFollowing,
                isLiked: isLiked ? true : false,
            };
        })
    );

    if(sortBy === 'new'){
        result = postsWithCommentCount;
    }else if(sortBy === 'comment'){
        const sortedPostsWithCommentCount = result.sort((a, b) => b.commentCount - a.commentCount);
        result = sortedPostsWithCommentCount;
    }else {
        result = postsWithCommentCount;
    }

    res.status(200).json({
        message: `${category} 카테고리 ${page ? `${getPaginationInfo(result, page, pageSize).page} 페이지` : `모든`} 게시글 목록`,
        data: {
            posts: result,
            pageInfo: getPaginationInfo(result, page, pageSize),
        },
    });
};

const getPopularPosts = async (req, res, next) => {     
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7); // 일주일 기준
    const currentUserId = req.tokenData.id;

    let popularPosts = await postService.getPopularPosts(weekAgo);
    const postsWithCommentCount = await Promise.all(
        popularPosts.map(async (post) => {
            post = await Post.findById(post._id).populate('author', '_id name profile_url roles');
            const commentCount = await CommentService.getCommentCount(post._id);
            const isFollowing = await Follow.findOne({ from: currentUserId, to: post.author });
            const isLiked = await LikeService.findLikeByUserAndPost(currentUserId, post._id) !== null;
            return { 
                ...post._doc,
                isPopular: true, 
                commentCount, 
                isFollowing: isFollowing? true : false,
                followList: isFollowing,
                isLiked: isLiked? true : false,
            };
        })
    );

    popularPosts = postsWithCommentCount;

    res.status(200).json({
        message: "인기 게시글 목록",
        data: {
            posts: popularPosts,
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

    post = postsWithCommentCount;

    res.status(200).json({
        message: `${author}가 작성한 글 목록`,
        data: post
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
    const { title, content, category } = req.body;
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
        category
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