const { Schema } = require("mongoose");

const UserSkillSchema = new Schema({
  //   user: {
  //     type: Schema.Types.ObjectId,
  //     ref: "user",
  //     required: true,
  //   },
  //   skill: {
  //     type: Schema.Types.ObjectId,
  //     ref: "skill",
  //     required: true,
  //   },

  user: {
    type: String,
    ref: "user",
    required: true,
  },
  skill: {
    type: String,
    ref: "skill",
    required: true,
  },

  //   user: {
  //     type: String,
  //   },

  //   skill: {
  //     type: String,
  //   },
});

module.exports = { UserSkillSchema };
