const { UserSkill } = require("../db");

//전원 호출 (모든 문서를 호출하기)
const getAllUserSkills = async () => {
  return await UserSkill.find({});
};

//get 유저에 해당되는 문서만 가져오기 (ex:유저a가 알고있는 모든 스킬)
//유저 고유 아이디를 어떻게??

const getUserSkillsByUser = async (user) => {
  return await UserSkill.find({ user: String(user) }).exec();
};

//get 스킬에 해당되는 문서만 가져오기 (ex:스킬a를 가지고있는 모든 유저 불러오기)

const getUserSkillsBySkill = async (skill) => {
  return await UserSkill.find({ skill: skill }).exec();
};

//관게 문서 추가 (ex:유저a - 스킬b를 추가할 때)
const addUserSkill = async (data) => {
  return UserSkill.create(data);
};

//관계 문서 수정은 필요 없을 것 같음. (추가 or 삭제 뿐이니까..)

//관계 문서 삭제
const removeUserSkill = async (id) => {
  await UserSkill.findOneAndDelete({ _id: id });

  return;
};

module.exports = {
  getAllUserSkills,
  getUserSkillsByUser,
  getUserSkillsBySkill,
  addUserSkill,
  removeUserSkill,
};
