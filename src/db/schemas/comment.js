const { Schema } = require('mongoose');

const CommentSchema = new Schema({
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

module.exports = { CommentSchema };