const { User } = require('../db');

//특정 유저의 기수 조회
const getUserGenerationInfo = async (userId) => {
  const user = await User.findById(userId).select(
    'generation_type generation_number'
  );
  return user
    ? {
        generationType: user.generation_type,
        generationNumber: user.generation_number,
      }
    : null;
};

//generation_type이랑 generation_number 둘 다 만족하는 유저 조회
const getUsersByGeneration = async (generationType, generationNumber) => {
  return await User.find({
    generation_type: generationType,
    generation_number: generationNumber,
  });
};

// 기수 추가
const addGenerationNumber = async (userId, generationNumber) => {
  return await User.findByIdAndUpdate(
    userId,
    { $set: { generation_number: generationNumber } },
    { new: true }
  );
};

//generation_number 수정
const updateGenerationNumber = async (userId, newGenerationNumber) => {
  return await User.findByIdAndUpdate(
    userId,
    { generation_number: newGenerationNumber },
    { new: true }
  );
};

//generation_number 삭제
const removeGenerationNumber = async (userId) => {
  return await User.findByIdAndUpdate(
    userId,
    { $unset: { generation_number: '' } },
    { new: true }
  );
};

module.exports = {
  getUserGenerationInfo,
  getUsersByGeneration,
  updateGenerationNumber,
  removeGenerationNumber,
  addGenerationNumber,
};
