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
    category: {
        type: String,
        enum: ["fb","qna","study","side-project","review"],
        required: true
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    }
    },{timestamps: true,
});

module.exports = { FBPostSchema };
