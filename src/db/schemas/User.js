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
  profile_url: {
    type: String,
    default: '',
  },
  generation: {
    type: Schema.Types.ObjectId,
    ref: 'Generation',
    required: true,
  },
  roles: {
    type: String,
    enum: ['USER', 'COACH', 'ADMIN'],
    default: 'USER',
  },
  is_coach: {
    type: Boolean,
    default: false,
  },

  links: [
    {
      title: { type: String },
      url: { type: String },
    },
  ],

  skills: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Skill',
      default: [],
    },
  ],
});

module.exports = { UserSchema };
