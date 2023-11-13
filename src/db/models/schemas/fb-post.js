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
    like_count: {
        type: Number,
        required: true
    },
    post_type: {
        type: Number,
        required: true
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    }
    },{timestamps: true,
});

module.exports = { FBPostSchema };