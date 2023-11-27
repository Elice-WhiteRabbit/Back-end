const { User } = require('../db');

//get 스킬에 해당되는 문서만 가져오기 (ex:스킬a를 가지고있는 모든 유저 불러오기)

const getUsersBySkill = async (skill) => {
  return await User.find(
    { skills: skill }
    //{ skills: { $elemMatch: { skill } } }
    // (err, data)
  );
};

const updateUserSkills = async ({ userId, skills }) => {
  // 사용자 존재 여부 확인
  console.log('Requested User ID:', userId);
  const user = await User.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }

  // 사용자의 스킬 업데이트
  user.skills = skills;
  await user.save();

  return await User.findById(userId).populate('skills', 'skill');
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
  updateUserSkills,
  removeUserSkill,
};
