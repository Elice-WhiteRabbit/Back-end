const { Schema } = require("mongoose");

const PostSchema = new Schema({
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
        dafault: 0
    },
    like_count: {
      type: Number,
      default: 0,
  },
    category: {
        type: String,
        enum: ["fb","qna","study","side-project","review"],
        required: true
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required:true
    },
    image_url: {
        type: String,
        default: ""
    }
    },{timestamps: true,
});

module.exports = { PostSchema };
