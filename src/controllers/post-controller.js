const postService = require('../services/post-service');

const postType = {
    fb: "fb",
    qna: "qna",
    study: "study",
    sideProject: "side-project",
    review: "review"
};

const paginatePosts = async (list, page, pageSize) => {
    if (!page && !pageSize) {
        return {
            paginatedPosts: list,
            pageInfo: null,
        };
    }
    
    // 페이징 기본 설정 : 1페이지 당 5 게시물
    page = parseInt(page) || 1;
    pageSize = parseInt(pageSize) || 5;

    const totalPosts = list.length;
    const totalPages = Math.ceil(totalPosts / pageSize);
    const skip = (page - 1) * pageSize;

    const paginatedPosts = list.slice(skip, skip + pageSize);

    return {
        paginatedPosts,
        pageInfo: {
            page: parseInt(page),
            pageSize: parseInt(pageSize),
            totalPosts,
            totalPages,
        },
    };
};

const addPost = async (req, res, next) => {
    const { title, content, category, author } = req.body;

    const createdPost = await postService.addPost({
        title,
        content,
        category,
        author
    });

    res.status(201).json({
        message: "post생성",
        data: createdPost
    });
};

const findPostByCategory = async (req, res, next) => {
    const { category } = req.params;

    if (!postType[category]) {
        throw {
            status: 400,
            message: "게시글 카테고리를 확인해주세요",
        };
    }

    const list = await postService.findPostByCategory(category);
    let { page, pageSize } = req.query;

    const { paginatedPosts, pageInfo } = await paginatePosts(list, page, pageSize);

    res.status(200).json({
        message: `${category} 카테고리 ${page ? `${pageInfo.page} 페이지` : '모든'} 게시글 목록`,
        data: {
            posts: paginatedPosts,
            pageInfo,
        },
    });
};

const findAllPost = async (req, res, next) => {
    let { page, pageSize } = req.query;
    const allPosts = await postService.findAllPost();

    const { paginatedPosts, pageInfo } = await paginatePosts(allPosts, page, pageSize);

    res.status(200).json({
        message: `${page ? `${pageInfo.page} 페이지` : '모든'} 게시글 조회`,
        data: {
            posts: paginatedPosts,
            pageInfo,
        },
    });
};

const findPostByAuthor = async (req, res, next) => {
    const { author } = req.params;

    const list = await postService.getPostByAuthor(author);

    // author를 user name으로?
    res.status(200).json({
        message: `${author}가 작성한 글 목록`,
        data: list
    });
};

const modifyPost = async (req, res, next) => {
    const { title, content, category } = req.body;
    const { id } = req.params;

    const updatedPost = await postService.setPost({
        id, 
        title, 
        content, 
        category
    });

    res.status(200).json({
        message: "게시글을 수정했습니다",
        data:updatedPost
    });
};

const removePost = async (req, res, next) => {
    const { id } = req.params;

    await postService.deletePost(id);

    res.status(200).json({
        message: "게시글을 삭제했습니다"
    });
};

module.exports = {
    addPost,
    modifyPost,
    findAllPost,
    findPostByCategory,
    findPostByAuthor,
    removePost,
}