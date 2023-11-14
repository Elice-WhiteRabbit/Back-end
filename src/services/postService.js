const { Post } = require('../db');

const addPost = async (title, content, category, author) => {
    try{
        const newPost = { title, content, category, author };

        const addedPost = await Post.create(newPost);

        return addedPost;
    } catch(err) {
        throw err;
    }
}

const getPostByCategory = async (category) => {
    try{
        const list = await Post.find({ category }).sort({updatedAt:-1})

        return list;
    } catch(err) {
        throw err;
    }
}

const getAllPost = async () => {
    try{
        const list = await Post.find({}).sort({updatedAt:-1});

        return list;

    } catch(err) {
        throw err;
    }
}

const getPostById = async ( id ) => {
    try{
        const post = await Post.findById(id);

        return post;
    } catch(err) {
        throw(err);
    }
}

const getPostByAuthor = async (author) => {
    try{
        // const check = await User.findById({author});
        // if(!check){
        //     throw {
        //         message: "존재하지 않는 유저입니다",
        //     };
        // }
        
        const list = await Post.find({ author });

        return list;
    } catch(err) {
        throw(err);
    }
}

const postService = {
    addPost,
    getAllPost,
    getPostByCategory,
    getPostById,
    getPostByAuthor,
}

module.exports = { postService };