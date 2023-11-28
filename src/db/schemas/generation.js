const { Schema } = require("mongoose");

const GenerationSchema = new Schema({
  generation_type: {
    type: String,
    required: true,
  },

  max_generation: {
    type: Number,
    required: true,
  },
});

module.exports = { GenerationSchema };
