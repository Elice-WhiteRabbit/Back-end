const { Schema } = require("mongoose");

const GenerationSchema = new Schema({
  // 트랙 이름
  generation_type: {
    type: String,
    required: true,
  },

  // 최대 기수
  generation: {
    type: Number,
    required: true,
  },
});

module.exports = { GenerationSchema };
