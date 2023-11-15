const { Schema } = require("mongoose");

const skillSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  skills: [String],
});

const Skill = mongoose.model("Skill", skillSchema);

module.exports = { skillSchema };
