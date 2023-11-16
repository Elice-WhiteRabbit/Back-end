const { Skill } = require("../db");

//get 하나의 스킬
const getSkill = async (id) => {
  return await Skill.findById(id);
};

//get 모든 스킬
const getAllSkills = async () => {
  return await Skill.find({});
};

//스킬 추가
const addSkill = async (data) => {
  return Skill.create(data);
};

//스킬 수정
const modifySkill = async (data) => {
  const { skill } = data;

  return Skill.findOneAndUpdate({ _id: data.id }, { skill }, { new: true });
};

//스킬 삭제
const removeSkill = async (id) => {
  await Skill.findOneAndDelete({ _id: id });

  return;
};

module.exports = {
  addSkill,
  modifySkill,
  removeSkill,
  getSkill,
  getAllSkills,
};
