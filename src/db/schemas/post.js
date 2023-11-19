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
    like: [
      {
        type: Schema.Types.ObjectId,
        ref:'user',
        default: []
    }],
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
