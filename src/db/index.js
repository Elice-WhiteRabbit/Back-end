const mongoose = require('mongoose');

const { CommentSchema } = require('./schemas/comment');
const { PostSchema } = require('./schemas/post');
const { FollowSchema } = require('./schemas/follow');

exports.Comment = mongoose.model('Comment', CommentSchema);
exports.Post = mongoose.model('Post', PostSchema);
exports.Follow = mongoose.model('Follow', FollowSchema);