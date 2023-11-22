const postService = require('../services/post-service');
const CommentService = require('../services/comment-service');

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
    const { title, content, category } = req.body;
    const author = req.tokenData.id;
   
    const createdPost = await postService.addPost({
        title,
        content,
        category,
        author
    });

    return res.status(201).json({
        message: "post생성",
        data: createdPost
    });
};

const findPostByCategory = async (req, res, next) => {
    const { category } = req.params;
    const { page, pageSize } = req.query;

    if (!postType[category]) {
        throw {
            status: 400,
            message: "게시글 카테고리를 확인해주세요",
        };
    }

    let result;
    if (!page && !pageSize) {
        // 쿼리값 없으면 전체 조회
        result = await postService.findAll(category);
        const postsWithCommentCount = await Promise.all(
            result.map(async (post) => {
                const commentCount = await CommentService.getCommentCount(post._id);
                const isPopular = post.like_count >= 1;
                return { ...post._doc, isPopular, commentCount };
            })
        );

        result = postsWithCommentCount;

    } else {
        result = await postService.findPostByCategory(category, page, pageSize);
        const postsWithCommentCount = await Promise.all(
            result.docs.map(async (post) => {
                const commentCount = await CommentService.getCommentCount(post._id);
                const isPopular = post.like_count >= 1;
                return { ...post._doc, isPopular, commentCount };
            })
        );

        result.docs = postsWithCommentCount;
    }

    res.status(200).json({
        message: `${category} 카테고리 ${page ? `${getPaginationInfo(result, page, pageSize).page} 페이지` : `모든`} 게시글 목록`,
        data: {
            posts: page ? result.docs: result,
            pageInfo: getPaginationInfo(result, page, pageSize),
        },
    });
};

const findAllPost = async (req, res, next) => {
    let { page, pageSize } = req.query;

    let result;
    if (!page && !pageSize) {
        // 쿼리값 없으면 전체 조회
        result = await postService.findAll();
        const postsWithCommentCount = await Promise.all(
            result.map(async (post) => {
                const commentCount = await CommentService.getCommentCount(post._id);
                const isPopular = post.like_count >= 1;
                return { ...post._doc, isPopular, commentCount };
            })
        );

        result = postsWithCommentCount;
        
    } else {
        result = await postService.findAllPost(page, pageSize);
        const postsWithCommentCount = await Promise.all(
            result.docs.map(async (post) => {
                const commentCount = await CommentService.getCommentCount(post._id);
                const isPopular = post.like_count >= 1;
                return { ...post._doc, isPopular, commentCount };
            })
        );

        result.docs = postsWithCommentCount;
    }

    res.status(200).json({
        message: `${page ? `페이지 ${page}` : '모든'} 게시글 조회`,
        data: {
            posts: page ? result.docs: result,
            pageInfo: getPaginationInfo(result, page, pageSize),
        },
    });
};

const getPopularPosts = async (req, res, next) => {     
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7); // 일주일 기준

    let popularPosts = await postService.getPopularPosts(weekAgo);
    const postsWithCommentCount = await Promise.all(
        popularPosts.map(async (post) => {
            const commentCount = await CommentService.getCommentCount(post._id);
            return { ...post, isPopular: true, commentCount };
        })
    );

    popularPosts = postsWithCommentCount;

    res.status(200).json({
        message: "인기 게시물 목록",
        data: {
            posts: popularPosts,
        },
    });
};

const findPostByAuthor = async (req, res, next) => {
    const { author } = req.params;

    let post = await postService.findPostByAuthor(author);
    const postsWithCommentCount = await Promise.all(
        post.map(async (post) => {
            const commentCount = await CommentService.getCommentCount(post._id);
            const isPopular = post.like_count >= 1;
            return { post, isPopular, commentCount };
        })
    );

    post = postsWithCommentCount;

    // author를 user name으로?
    res.status(200).json({
        message: `${author}가 작성한 글 목록`,
        data: post
    });
};

const findPostById = async (req, res, next) => {
    const { postId } = req.params;

    const post = await postService.findPostById(postId);
    

    if (!post) {
        return res.status(404).json({
            message: "게시글을 찾을 수 없습니다.",
        });
    }

    const commentCount = await CommentService.getCommentCount(postId);
    const isPopular = post.like_count >= 1;

    res.status(200).json({
        message: "게시글 조회 성공",
        data: {
            post,
            isPopular,
            commentCount
        }
    });
};

const modifyPost = async (req, res, next) => {
    const { title, content, category } = req.body;
    const { id } = req.params;
    const userId = req.tokenData.id;
    const post = await postService.findPostById(id);

    if (!post || post.author != userId) {
        return res.status(403).json({
            message: "게시물 수정 권한이 없습니다.",
        });
    }
    
    const updatedPost = await postService.modifyPost({
        id, 
        title, 
        content, 
        category
    });

    const commentCount = await CommentService.getCommentCount(id);
    const isPopular = post.like_count >= 1;

    res.status(200).json({
        message: "게시글을 수정했습니다",
        data: { ...updatedPost._doc, isPopular, commentCount }, // 기존 데이터와 댓글 개수를 합침
    });
};


const removePost = async (req, res, next) => {
    const { id } = req.params;
    const userId = req.tokenData.id;
    const post = await postService.findPostById(id);

    if (!post || post.author != userId) {
        return res.status(403).json({
            message: "게시물 삭제 권한이 없습니다.",
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