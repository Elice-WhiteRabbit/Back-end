const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {
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

  //토큰??
  refrechToken: String,

  //프로필 이미지 url
  profileUrl: {
    type: String,
    required: false,
  },
  //사용자 타입
  roles: {
    User: {
      type: Number,
      default: 0,
    },
    Coach: Number,
    Admin: Number,
  },
  //코치 승인 여부
  isCoach: {
    type: Boolean,
    default: false,
  },
});

//
module.exports = mongoose.model("User", userSchema);
