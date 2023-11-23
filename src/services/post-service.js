const { Post } = require('../db');
const mongoosePaginate = require('mongoose-paginate-v2');

Post.schema.plugin(mongoosePaginate);

const paginatePosts = async (query, options) => {
    const result = await Post.paginate(query, options);
    return result;
};

const addPost = async (data) => {
    return Post.create(data);
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

const searchPost = async (keyword) => {
    const lowercaseQuery = keyword.toLowerCase();
    const postsByTitleOrContent = await Post.find({
      $or: [
        { title: { $regex: lowercaseQuery, $options: 'i' } },
        { content: { $regex: lowercaseQuery, $options: 'i' } },
      ],
    }).populate('author', '_id name profile_url roles');
    const user = await User.findOne({ name: { $regex: lowercaseQuery, $options: 'i' } });
  
    if (user) {
      const postsByAuthor = await Post.find({ author: user._id })
        .populate('author', '_id name profile_url roles'); 
      const allPosts = [...postsByTitleOrContent, ...postsByAuthor];
      const uniquePosts = Array.from(new Set(allPosts.map((post) => post._id))).map(
        (id) => allPosts.find((post) => post._id === id)
      );
      return uniquePosts;
    } else {
      return postsByTitleOrContent;
    }
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
    searchPost,
};