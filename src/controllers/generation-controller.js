const {
  getUserGenerationInfo,
  getUsersByGeneration,
  setGenerationInfo,
  removeGenerationInfo,
  getAllGenerationInfo,
  getAllUniqueGenerations,
  updateGeneration,
  deleteGeneration,
  updateGenerationNumber,
  removeGenerationNumber,
  addGenerationNumber,
  addGenerationType,
  updateGenerationType,
  removeGenerationType,
} = require('../services/generation-service');

const generationService = require('../services/generation-service');

exports.addGeneration = async (req, res, next) => {
  const { type, number } = req.body;
  const createdGeneration = await generationService.addGeneration({
    type,
    number
  });

  res.status(201).json({
    message: "새 트랙이 생성되었습니다",
    data: createdGeneration
  });
}

exports.findAllGeneration = async (req, res, next) => {
  const list = await generationService.findAllGeneration();

  res.status(200).json({
    message: "트랙 목록 조회",
    data: list
  });
}

exports.modifyGeneration = async (req, res, next) => {
  const { id } = req.params;
  const { type, number } = req.body;

  const newGeneration = await generationService.modifyGeneration({
    id,
    type,
    number
  });

  res.status(200).json({
    message: "트랙 수정",
    data: newGeneration
  });
}

exports.removeGeneration = async (req, res, next) => {
  const { id } = req.params;

  await generationService.removeGeneration(id);

  res.status(200).json({
    message: "트랙 삭제"
  });
}

//관리자 트랙 삭제
exports.deleteGeneration = async (req, res) => {
  try {
    const { generationType, generationNumber } = req.body;

    // 직접 가져온 deleteGeneration 함수 사용
    await deleteGeneration(generationType, generationNumber);
    res.status(200).json({ message: 'Generation deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//관리자 트랙 생성
exports.updateGeneration = async (req, res) => {
  try {
    const {
      oldGenerationType,
      oldGenerationNumber,
      newGenerationType,
      newGenerationNumber,
    } = req.body;

    // 직접 가져온 updateGeneration 함수 사용
    await updateGeneration(
      oldGenerationType,
      oldGenerationNumber,
      newGenerationType,
      newGenerationNumber
    );
    res.status(200).json({ message: 'Generation updated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
//관리자 트랙 전체보기
exports.getAllUniqueGenerations = async (req, res) => {
  try {
    const generations = await getAllUniqueGenerations();
    res.status(200).json({
      message: 'Unique generations retrieved successfully',
      data: generations,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.setGenerationInfo = async (req, res) => {
  try {
    const userId = req.params.id;
    const { generationType, generationNumber } = req.body;

    // 여기서 직접 setGenerationInfo 함수를 호출
    const updatedUser = await setGenerationInfo(
      userId,
      generationType,
      generationNumber
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      message: 'Generation info updated successfully',
      data: updatedUser,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.removeGenerationInfo = async (req, res) => {
  try {
    const userId = req.params.id;

    // 여기서 직접 removeGenerationInfo 함수를 호출
    const updatedUser = await removeGenerationInfo(userId);

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      message: 'Generation info removed successfully',
      data: updatedUser,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllGenerationInfo = async (req, res) => {
  try {
    // 여기서 직접 getAllGenerationInfo 함수를 호출
    const users = await getAllGenerationInfo();

    res.status(200).json({
      message: 'All generation info retrieved successfully',
      data: users,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//유저가 가진 트랙,기수 불러오기
exports.getGenerationInfo = async (req, res) => {
  try {
    const userId = req.params.id;
    const generationInfo = await getUserGenerationInfo(userId);

    if (!generationInfo) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ data: generationInfo });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//기수,트랙 만족하는 유저 찾기
exports.findUsersByGeneration = async (req, res) => {
  try {
    const generationType = req.params.generationType;
    const generationNumber = parseInt(req.params.generationNumber);

    const users = await getUsersByGeneration(generationType, generationNumber);

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//기수 추가
exports.addGenerationNumber = async (req, res) => {
  try {
    const userId = req.params.id;
    const generationNumber = req.body.generationNumber;
    const updatedUser = await addGenerationNumber(userId, generationNumber);
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 유저의 generation_number 수정
exports.modifyGenerationNumber = async (req, res) => {
  try {
    const userId = req.params.id;
    const newGenerationNumber = req.body.generationNumber;
    const updatedUser = await updateGenerationNumber(
      userId,
      newGenerationNumber
    );
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 유저의 generation_number 삭제
exports.deleteGenerationNumber = async (req, res) => {
  try {
    const userId = req.params.id;
    const updatedUser = await removeGenerationNumber(userId);
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//트랙생성
exports.addGenerationType = async (req, res) => {
  try {
    const userId = req.params.id;
    const generationType = req.body.generationType;
    const user = await addGenerationType(userId, generationType);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res
      .status(200)
      .json({ message: 'Generation type added successfully', user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 트랙 수정
exports.modifyGenerationType = async (req, res) => {
  try {
    const userId = req.params.id;
    const generationType = req.body.generationType;
    const user = await updateGenerationType(userId, generationType);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res
      .status(200)
      .json({ message: 'Generation type updated successfully', user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 트랙 삭제
exports.deleteGenerationType = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await removeGenerationType(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res
      .status(200)
      .json({ message: 'Generation type removed successfully', user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
