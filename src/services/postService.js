const { Post } = require('../db/index');

const addPost = async () => {
    try{
        console.log("add Post");
    } catch(err) {
        throw err;
    }
}

const getPost = async () => {
    try{
        console.log("get Post")
    } catch(err) {
        throw err;
    }
}

const postService = {
    addPost,
    getPost,
}

module.exports = { postService };