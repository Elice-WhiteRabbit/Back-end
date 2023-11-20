const { User } = require("../db");

//get 스킬에 해당되는 문서만 가져오기 (ex:스킬a를 가지고있는 모든 유저 불러오기)

const getUsersBySkill = async (skill) => {
  return await User.find(
    { skills: skill }
    //{ skills: { $elemMatch: { skill } } }
    // (err, data)
  );
};

//관계 문서 추가 (ex:유저a - 스킬b를 추가할 때)
const addUserSkill = async (data) => {
  const user = await User.findById(data.userid);
  const skill = String(user).includes(data.skill);

  if (skill == true) {
    throw {
      status: 409,
      message: "이미 존재하는 스킬입니다",
    };
  }

  return await User.findByIdAndUpdate(
    data.userid,
    { $push: { skills: data.skill } }
    // { new: false }
  );
};

//관계 문서 수정은 필요 없을 것 같음. (추가 or 삭제 뿐이니까..)

//관계 문서 삭제
const removeUserSkill = async (data) => {
  return await User.findByIdAndUpdate(
    data.userid,
    { $pull: { skills: data.skill } }
    // { new: false }
  );
};

module.exports = {
  getUsersBySkill,
  addUserSkill,
  removeUserSkill,
};
