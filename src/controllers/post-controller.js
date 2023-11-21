const postService = require('../services/post-service');

const postType = {
    fb: "fb",
    qna: "qna",
    study: "study",
    sideProject: "side-project",
    review: "review"
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
        result = await postService.findAll();
    } else {
        result = await postService.findPostByCategory(category, page, pageSize);
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
    } else {
        result = await postService.findAllPost(page, pageSize);
    }

    res.status(200).json({
        message: `${page ? `페이지 ${page}` : '모든'} 게시글 조회`,
        data: {
            posts: page ? result.docs: result,
            pageInfo: getPaginationInfo(result, page, pageSize),
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