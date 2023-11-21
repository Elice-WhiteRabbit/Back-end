const { Post } = require('../db');
const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

Post.schema.plugin(mongoosePaginate);

const paginatePosts = async (query, options) => {
    const result = await Post.paginate(query, options);
    return result;
};

const addPost = async (data) => {
    return Post.create(data);
}; 

const findPostByCategory = async (category, page = 1, pageSize = 5) => {
    const options = {
        page: page,
        limit: pageSize,
        sort: { updatedAt: -1 },
    };

    const query = { category: category };
    const result = await paginatePosts(query, options);
    return result;
};

const findAll = async () => {
    return Post.find({}).sort({updatedAt:-1});
};

// 페이지네이션
const findAllPost = async (page = 1, pageSize = 5) => {
    const options = {
        page: page,
        limit: pageSize,
        sort: { updatedAt: -1 },
    };
    const result = await Post.paginate({}, options);
    return result;
};

const findPostById = async (id) => {
    return Post.findById(id); 
};

const findPostByAuthor = async (author) => {
    return Post.find({ author });
};

const modifyPost = async (data) => {
    const { title, content, category } = data;

    return Post.findByIdAndUpdate(
        data.id,
        { title, content, category },
        { new: true }
    );
};

const removePost = async (id) => {
    await Post.findByIdAndDelete(id);
    return;
};

module.exports = {
    addPost,
    modifyPost,
    findAll,
    findAllPost,
    findPostByCategory,
    findPostById,
    findPostByAuthor,
    removePost,
};