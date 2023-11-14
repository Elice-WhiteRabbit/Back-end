const { Schema } = require('mongoose');

const CoachSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    generation_type: {
        type: String,
        enum: ["SW 트랙", "AI트랙"],
        required: true
    },
    generation_number: {
        type: Number,
        required: true
    },
    req_status: {
        type: Boolean,
        default: false
    }
});

module.exports = { CoachSchema };