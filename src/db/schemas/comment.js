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
    content: {
        type: String,
        required: true
    },
    },{timestamps: true,
});

module.exports = { FBCommentSchema };