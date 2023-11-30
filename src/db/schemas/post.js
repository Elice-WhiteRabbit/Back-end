const { Schema } = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const PostSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    view_count: {
      type: Number,
      default: 0,
    },
    like_count: {
      type: Number,
      default: 0,
    },
    category: {
      type: String,
      enum: ['BOARD', 'QNA', 'STUDY', 'PROJECT', 'REVIEW'],
      required: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    image_url: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

PostSchema.plugin(mongoosePaginate);
module.exports = { PostSchema };