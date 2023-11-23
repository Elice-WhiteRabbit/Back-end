const { Post } = require('../db');
const mongoosePaginate = require('mongoose-paginate-v2');
const CommentService = require('../services/comment-service');

Post.schema.plugin(mongoosePaginate);

const paginatePosts = async (query, options) => {
    
    const result = await Post.paginate(query, options);
    return result;
};

const addPost = async (data) => {
    return Post.create(data);
};

const getPostWithCommentCount = async (post) => {
    const commentCount = await CommentService.getCommentCount(post._id);
    return { ...post.toObject(), commentCount };
};

const findPostByCategory = async (category, page = 1, pageSize = 5, sortBy = 'new') => {
    const options = {
        page: page,
        limit: pageSize,
        sort: { updatedAt: -1 }, 
    };

    const query = { category: category };
    const result = await paginatePosts(query, options);
    return result;

};

const findAll = async (category) => {
    const query = category ? { category } : {};
    return Post.find(query).sort({ updatedAt: -1 });
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

const getPopularPosts = async (weekAgo) => {
    const pipeline = [
        {
            $match: {
                createdAt: { $gte: weekAgo },
                like_count: { $gte: 1 },
            },
        },
        {
            $sort: { like_count: -1 },
        },
        {
            $project: {
                title: 1,
                content: 1,
                like_count: 1,
                author: 1,
                createdAt: 1,
                isPopular: true,
            },
        },
    ];

    const popularPosts = await Post.aggregate(pipeline).exec();
    return popularPosts;
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
    getPopularPosts,
};
