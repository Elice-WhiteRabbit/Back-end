const { Schema } = require("mongoose");
const bcrypt = require('bcrypt');

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
  profile_url: {
    type: String,
    default:""
  },
  generation_type: {
    type: String,
    enum: ['SW 엔지니어 트랙', '풀스택 AI 트랙'],
    required: true
  },
  generation_number: {
    type: Number,
    required: true
  },
  roles: {
    type: String,
    enum: ['User', 'Coach', 'Admin'],
    default: 'User'
  },
  is_coach: {
    type: Boolean,
    default: false,
  },
});

UserSchema.pre("save", async function (next){
  const user = this;

  if (!user.isModified('password')) {
    return next();
  }

  try {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    user.password = hashedPassword;

    next();
  } catch (err) {
    throw err;
  }
});

module.exports = { UserSchema };