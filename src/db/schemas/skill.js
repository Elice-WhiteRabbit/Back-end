const { Schema } = require("mongoose");

const SkillSchema = new Schema({
  skill: { type: String },
});

module.exports = { SkillSchema };
