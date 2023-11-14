const { Schema } = require('mongoose');

const CoachSchema = new Schema({
    email: {
        type: string,
        required: true
    },
    name: {
        type: string,
        required: true
    },
    generation_type: {
        type: string,
        enum: ["SW 트랙", "AI트랙"],
        required: true
    },
    generation_number: {
        type: number,
        required: true
    },
    req_status: {
        type: Boolean,
        default: false
    }
});

module.exports = { CoachSchema };