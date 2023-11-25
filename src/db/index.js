const mongoose = require('mongoose');
const { CommentSchema } = require('./schemas/comment');
const { PostSchema } = require('./schemas/post');
const { FollowSchema } = require('./schemas/follow');
const { UserSchema } = require('./schemas/User');
const { SkillSchema } = require('./schemas/skill');
const { UserSkillSchema } = require('./schemas/user-skill');
const { LikeSchema } = require('./schemas/like');

exports.Comment = mongoose.model('Comment', CommentSchema);
exports.Post = mongoose.model('Post', PostSchema);
exports.Follow = mongoose.model('Follow', FollowSchema);
exports.User = mongoose.model('User', UserSchema);
exports.Skill = mongoose.model('Skill', SkillSchema);
exports.UserSkill = mongoose.model('UserSkill', UserSkillSchema);
exports.Like = mongoose.model('Like', LikeSchema);
