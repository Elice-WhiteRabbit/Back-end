const { Schema } = require('mongoose');
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
    default: '',
  },
  //(note)프로필url 주석처리해야 유저 생성이 됨.
  generation_type: {
    type: String,
    enum: ['SW 엔지니어 트랙', '풀스택 AI 트랙'],
    required: true,
  },
  generation_number: {
    type: Number,
    required: true,
  },
  roles: {
    type: String,
    enum: ['User', 'Coach', 'Admin'],
    default: 'User',
  },
  is_coach: {
    type: Boolean,
    default: false,
  },

  links: [
    {
      type: String,
      default: [],
    },
  ],

  skills: [
    {
      type: Schema.Types.ObjectId,
      ref: 'skill',
      default: [],
    },
  ],
});

UserSchema.pre('save', async function (next) {
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
