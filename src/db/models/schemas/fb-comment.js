const { Schema } = require('mongoose');

const FBCommentSchema = new Schema({
    post: {
        type: Schema.Types.ObjectId,
        ref: 'fb-post',
        required: true
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    parent_comment: {
        type: Schema.Types.ObjectId,
        ref: 'fb-comment'
    },
    content: {
        type: String,
        required: true
    },
    depth: {
        type: Number,
        default: 1
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
    },{timestamps: true,
});

module.exports = { FBCommentSchema };