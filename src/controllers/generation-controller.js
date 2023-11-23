const {
  getUserGenerationInfo,
  getUsersByGeneration,
  updateGenerationNumber,
  removeGenerationNumber,
  addGenerationNumber,
  addGenerationType,
  updateGenerationType,
  removeGenerationType,
} = require('../services/generation-service');

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