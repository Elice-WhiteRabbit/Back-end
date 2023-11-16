const { Schema } = require("mongoose");

const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  //프로필 이미지 url
  profileUrl: {
    type: String
  },
  roles: {
    type: String,
    enum: ['User', 'Coach', 'Admin'],
    default: 'User',
  },
  isCoach: {
    type: Boolean,
    default: false,
  },
});

module.exports = { UserSchema };