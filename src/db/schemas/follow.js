const { Schema } = require('mongoose');

const FollowSchema = new Schema({
    to: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    from: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true 
    }
});

module.exports = { FollowSchema };