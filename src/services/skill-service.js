const { Skill } = require('../db');

//get 하나의 스킬
const findSkill = async (id) => {
  return await Skill.findById(id);
};

//get 모든 스킬
const findAllSkills = async () => {
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
  return await Skill.findOneAndDelete({ _id: id });
};

const searchSkill = async (query) => {
  return Skill.find({ skill: { $regex: query, $options: 'i' } });
};

module.exports = {
  addSkill,
  modifySkill,
  removeSkill,
  findSkill,
  findAllSkills,
  searchSkill,
};
