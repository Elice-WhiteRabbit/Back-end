const mongoose = require('mongoose');

const { FBCommentSchema } = require('./schemas/comment');
const { FBPostSchema } = require('./schemas/post');
const { FollowSchema } = require('./schemas/follow');
const { CoachSchema } = require('./schemas/coach-request');

exports.FBComment = mongoose.model('FBComment', FBCommentSchema);
exports.FBPost = mongoose.model('FBPost', FBPostSchema);
exports.Follow = mongoose.model('Follow', FollowSchema);
exports.Coach = mongoose.model('Coach', CoachSchema);