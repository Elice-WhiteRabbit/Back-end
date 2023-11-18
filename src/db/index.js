const mongoose = require('mongoose');

const { CommentSchema } = require('./schemas/comment');
const { PostSchema } = require('./schemas/post');
const { FollowSchema } = require('./schemas/follow');
const { UserSchema } = require('./schemas/user');
const { LikeSchema } = require('./schemas/like');

exports.User = mongoose.model('User', UserSchema);
exports.Comment = mongoose.model('Comment', CommentSchema);
exports.Post = mongoose.model('Post', PostSchema);
exports.Follow = mongoose.model('Follow', FollowSchema);
exports.Like = mongoose.model('Like', LikeSchema);