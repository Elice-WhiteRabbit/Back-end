const { postService } = require('../services/postService');

const addPost = async (req, res, next) => {
    try{
        await postService.addPost();
        res.status(201).json({
            message: "post추가",
            data:[]
        })
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

const postController = {
    addPost,
    getPost,
}

module.exports = { postController };