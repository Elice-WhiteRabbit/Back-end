const { Schema } = require("mongoose");

const generationSchema = new Schema({
  generation_type: {
    type: String,
    required: true,
  },

  max_generation: {
    type: Number,
    required: true,
  },
});

module.exports = { generationSchema };
