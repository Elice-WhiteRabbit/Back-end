const { Post } = require('../db');

const addPost = async (data) => {
    try{
        return await Post.create(data);
    } catch(err) {
        throw err;
    }
}

const getPostByCategory = async (category) => {
    try{
        return await Post.find({ category }).sort({updatedAt:-1})
    } catch(err) {
        throw err;
    }
}

const getAllPost = async () => {
    try{
        return await Post.find({}).sort({updatedAt:-1});

    } catch(err) {
        throw err;
    }
}

const getPostById = async ( id ) => {
    try{
        return await Post.findById(id);
    } catch(err) {
        throw err;
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

        return await Post.find({ author });
    } catch(err) {
        throw err;
    }
}

const setPost = async (data) => {
    try{
        const { title, content, category } = data;

        return await Post.findOneAndUpdate(
            { _id:data.id },
            { title, content, category },
            { new:true }
        );
    } catch(err) {
        throw err;
    }
}

const deletePost = async (id) => {
    try{
        await Post.findOneAndDelete({_id:id});

        return;
    } catch(err) {
        throw err;
    }
}

const postService = {
    addPost,
    setPost,
    getAllPost,
    getPostByCategory,
    getPostById,
    getPostByAuthor,
    deletePost,
}

module.exports = { postService };