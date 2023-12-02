const { Post } = require('../db');
const userService = require('../services/user-service');
const mongoosePaginate = require('mongoose-paginate-v2');

Post.schema.plugin(mongoosePaginate);

const paginatePosts = async (array, options) => {
    const ids = array.map(item => item._id);
    const query = ids.length > 0 ? { _id: { $in: ids } } : {};
    const result = await Post.paginate(query, options);
    return result;
};  

const addPost = async (data) => {
  return Post.create(data);
};

const findPostByCategory = async (category, page, pageSize) => {
    const options = {
      page: page,
      limit: pageSize,
      sort: { createdAt: -1 },
    };
  
    const query = { category: category };
    const result = await Post.paginate(query, options);
    return result;
};
  

const findAll = async (category) => {
  const query = category ? { category } : {};
  return Post.find(query).sort({ createdAt: -1 });
};

const findPostById = async (id) => {
  const post = await Post.findById(id);
  if (post) {
    post.view_count += 1; // 조회수 증가
    await post.save();
  }
  return post;
};

const findPostByAuthor = async (author) => {
  return Post.find({ author });
};

const modifyPost = async (data) => {
  const { title, content, category, image_url } = data;

  return Post.findByIdAndUpdate(
    data.id,
    { title, content, category, image_url },
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
        like_count: { $gte: 5 },
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
    const allPosts = await findAll(); 
    const searchResult = await Promise.all(allPosts.map(async (post) => {
        const titleMatch = post.title.includes(keyword);
        const contentMatch = post.content.includes(keyword);

        const author = await userService.findUserById(post.author);
        const authorNameMatch = author.name.includes(keyword);

        return titleMatch || contentMatch || authorNameMatch;
    }));

    return allPosts.filter((_, index) => searchResult[index]);
};

module.exports = {
  addPost,
  modifyPost,
  findAll,
  findPostByCategory,
  findPostById,
  findPostByAuthor,
  removePost,
  getPopularPosts,
  searchPost,
  paginatePosts,
};