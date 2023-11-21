const { Schema } = require('mongoose');

const LikeSchema = new Schema({
    post: {
        type: Schema.Types.ObjectId,
        ref: 'post',
        required: true,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true,
    },
}, { timestamps: true });

module.exports = { LikeSchema };