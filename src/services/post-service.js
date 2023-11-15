const { Post } = require('../db');

const addPost = async (data) => {
    return Post.create(data);
};

const findPostByCategory = async (category) => {
    return Post.find({ category }).sort({updatedAt:-1});
};

const findAllPost = async () => {
    return Post.find({}).sort({updatedAt:-1});
};

const findPostById = async ( id ) => {
    return Post.findById(id);
};

const findPostByAuthor = async (author) => {
    // const check = await User.findById({author});
    // if(!check){
    //     throw {
    //         message: "존재하지 않는 유저입니다",
    //     };
    // }

    return Post.find({ author });
};

const modifyPost = async (data) => {
    const { title, content, category } = data;

    return Post.findOneAndUpdate(
        { _id:data.id },
        { title, content, category },
        { new:true }
    );
};

const removePost = async (id) => {
    await Post.findOneAndDelete({_id:id});

    return;
};

module.exports = {
    addPost,
    modifyPost,
    findAllPost,
    findPostByCategory,
    findPostById,
    findPostByAuthor,
    removePost,
};