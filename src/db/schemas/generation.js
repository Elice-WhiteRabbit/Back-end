const { Schema } = require("mongoose");

const GenerationSchema = new Schema({
  type: {
    type: String,
    required: true,
  },

  number: {
    type: Number,
    required: true,
  },
});

module.exports = { GenerationSchema };
