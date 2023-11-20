const { Schema } = require("mongoose");

const linkSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  link: [String],
});

const Link = mongoose.model("Link", linkSchema);

module.exports = { linkSchema };
