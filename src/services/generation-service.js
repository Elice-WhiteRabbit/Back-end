const { User } = require('../db');
const { Generation } = require('../db');

const addGeneration = async (data) => {
  const { type, number } = data;

  return Generation.create({
    type,
    number
  });
}

const findAllGeneration = async () => {
  return Generation.find({});
}

const modifyGeneration = async (data) => {
  const { id, type, number } = data;

  return Generation.findByIdAndUpdate(
    id,
    {
      type,
      number
    },
    { new: true }
  );
}

const removeGeneration = async (id) => {
  return Generation.findByIdAndDelete(id);
}

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

//---------------------------------------------------------------
// generation_type과 generation_number 설정
const setGenerationInfo = async (userId, generationType, generationNumber) => {
  return await User.findByIdAndUpdate(
    userId,
    { generation_type: generationType, generation_number: generationNumber },
    { new: true }
  );
};

// generation_type과 generation_number 삭제
const removeGenerationInfo = async (userId) => {
  return await User.findByIdAndUpdate(
    userId,
    { $set: { generation_type: '', generation_number: '' } },
    { new: true }
  );
};

// 전체 사용자의 generation_type과 generation_number 조회
const getAllGenerationInfo = async () => {
  return await User.find({}, 'generation_type generation_number');
};

//관리자 전체 트랙 집계
const getAllUniqueGenerations = async () => {
  return User.aggregate([
    {
      $group: {
        _id: {
          generationType: '$generation_type',
          generationNumber: '$generation_number',
        },
      },
    },
    {
      $project: {
        _id: 0,
        generationType: '$_id.generationType',
        generationNumber: '$_id.generationNumber',
      },
    },
    { $sort: { generationType: 1, generationNumber: 1 } },
  ]);
};
//관리자 트랙 삭제
const deleteGeneration = async (generationType, generationNumber) => {
  return await User.updateMany(
    { generation_type: generationType, generation_number: generationNumber },
    { $unset: { generation_type: '', generation_number: '' } }
  );
};

//관리자 트랙 생성
const updateGeneration = async (
  oldGenerationType,
  oldGenerationNumber,
  newGenerationType,
  newGenerationNumber
) => {
  return await User.updateMany(
    {
      generation_type: oldGenerationType,
      generation_number: oldGenerationNumber,
    },
    {
      $set: {
        generation_type: newGenerationType,
        generation_number: newGenerationNumber,
      },
    }
  );
};

//--------------------------------------------------------------------------------------

// // 기수 추가
// const addGenerationNumber = async (userId, generationNumber) => {
//   return await User.findByIdAndUpdate(
//     userId,
//     { $set: { generation_number: generationNumber } },
//     { new: true }
//   );
// };

// //기수 수정
// const updateGenerationNumber = async (userId, newGenerationNumber) => {
//   return await User.findByIdAndUpdate(
//     userId,
//     { generation_number: newGenerationNumber },
//     { new: true }
//   );
// };

// //기수 삭제
// const removeGenerationNumber = async (userId) => {
//   return await User.findByIdAndUpdate(
//     userId,
//     { $unset: { generation_number: '' } },
//     { new: true }
//   );
// };

// //트랙 생성
// const addGenerationType = async (userId, generationType) => {
//   return await User.findByIdAndUpdate(
//     userId,
//     { generation_type: generationType },
//     { new: true }
//   );
// };

// // 트랙 수정
// const updateGenerationType = async (userId, generationType) => {
//   return await User.findByIdAndUpdate(
//     userId,
//     { generation_type: generationType },
//     { new: true }
//   );
// };

// // 트랙 삭제
// const removeGenerationType = async (userId) => {
//   return await User.findByIdAndUpdate(
//     userId,
//     { $unset: { generation_type: '' } },
//     { new: true }
//   );
// };

module.exports = {
  addGeneration,
  findAllGeneration,
  modifyGeneration,
  removeGeneration,

  getUserGenerationInfo,
  getUsersByGeneration,
  // setGenerationInfo,
  // removeGenerationInfo,
  getAllGenerationInfo,
  getAllUniqueGenerations,
  updateGeneration,
  deleteGeneration,

  // updateGenerationNumber,
  // removeGenerationNumber,
  // addGenerationNumber,
  // addGenerationType,
  // updateGenerationType,
  // removeGenerationType,
  //---------------------------------//
};
