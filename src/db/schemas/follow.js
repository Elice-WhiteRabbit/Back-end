const { Schema } = require('mongoose');

const FollowSchema = new Schema({
    from: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true 
    },
    to: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});

module.exports = { FollowSchema };