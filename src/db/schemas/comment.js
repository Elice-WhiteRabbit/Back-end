const { Schema } = require('mongoose');

const CommentSchema = new Schema({
    post: {
        type: Schema.Types.ObjectId,
        ref: 'post',
        required: true
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    content: {
        type: String,
        required: true
    },
    },{timestamps: true,
});

module.exports = { CommentSchema };