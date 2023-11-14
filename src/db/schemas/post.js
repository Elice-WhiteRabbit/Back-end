const { Schema } = require('mongoose');

const FBPostSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    view_count: {
        type: Number,
        required: true
    },
    like: [{
        type: Schema.Types.ObjectId,
        ref:'user',
        required: true
    }],
    post_type: {
        type: String,
        enum: ["자유게시판", "취업후기"],
        required: true
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    }
    },{timestamps: true,
});

module.exports = { FBPostSchema };