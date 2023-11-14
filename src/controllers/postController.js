const { postService } = require('../services/postService');

const postType = ["fb","qna","study","side-project","review"];

const addPost = async (req, res, next) => {
    try{
        const { title, content, category, author } = req.body;
    
        const createdPost = await postService.addPost(title, content, category, author);

        res.status(201).json({
            message: "post생성",
            data: createdPost
        });
    } catch(err) {
        next(err);
    }
}

const getPost = async (req, res, next) => {
    try{
        await postService.getPost();

        res.status(200).json({
            message: "post검색",
            data:[]
        })
    } catch(err) {
        next(err);
    }
}

const getPostByCategory = async (req, res, next) => {
    try{
        const { category } = req.params;

        if(!postType.includes(category)){
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

    } catch(err) {
        next(err);
    }
}

const getAllPost = async (req, res, next) => {
    try{
        const list = await postService.getAllPost();

        res.status(200).json({
            message: "전체 리스트",
            data: list
        });
    } catch(err) {
        next(err);
    }
}

const getPostByAuthor = async (req, res, next) => {
    try{
        const { author } = req.params;

        const list = await postService.getPostByAuthor(author);

        // author를 user name으로?
        res.status(200).json({
            message: `${author}가 작성한 글 목록`,
            data: list
        });

    } catch(err) {
        next(err);
    }
}

const setPost = async (req, res, next) => {
    try{
        const { title, content, category } = req.body;
        const { id } = req.params;

        const updatedPost = await postService.setPost(
            id, 
            title, 
            content, 
            category
        );

        res.status(200).json({
            message: "게시글을 수정했습니다",
            data:updatedPost
        });
    } catch(err) {
        next(err);
    }
}

const deletePost = async (req, res, next) => {
    try{
        const { id } = req.params;

        await postService.deletePost(id);

        res.status(200).json({
            message: "게시글을 삭제했습니다"
        });
    } catch(err) {
        next(err);
    }
}

const postController = {
    addPost,
    getPost,
    setPost,
    getAllPost,
    getPostByCategory,
    getPostByAuthor,
    deletePost,
}

module.exports = { postController };