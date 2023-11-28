const { Schema } = require("mongoose");

const generationSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  //트랙명(ex:SW)
  generation_type: {
    type: String,
    required: true,
  },

  //기수(ex:6기)
  max_generation: {
    type: Number,
    required: true,
  },
});

const Generation = mongoose.model("Generation", generationSchema);

module.exports = { generationSchema };
