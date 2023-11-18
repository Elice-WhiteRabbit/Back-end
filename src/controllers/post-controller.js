const postService = require('../services/post-service');

const postType = {
    fb: "fb",
    qna: "qna",
    study: "study",
    sideProject: "side-project",
    review: "review"
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

    if(!postType[category]){
        throw {
            status: 400,
            message: "게시글 카테고리를 확인해주세요"
        };
    }

    const list = await postService.getPostByCategory(category);
    res.status(200).json({
        message: `${category} 카테고리 요청 결과`,
        data: list
    })
};

const findAllPost = async (req, res, next) => {
    const list = await postService.findAllPost();

    res.status(200).json({
        message: "전체 리스트",
        data: list
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