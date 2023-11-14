const mongoose = require('mongoose');

const { FBCommentSchema } = require('./schemas/fb-comment');
const { FBPostSchema } = require('./schemas/fb-post');
const { FollowSchema } = require('./schemas/follow');

exports.FBComment = mongoose.model('FBComment', FBCommentSchema);
exports.FBPost = mongoose.model('FBPost', FBPostSchema);
exports.Follow = mongoose.model('Follow', FollowSchema);