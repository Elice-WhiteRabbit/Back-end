const { updateUserLinks } = require('../services/link-service');

exports.updateLinks = async (req, res) => {
  try {
    const userId = req.params.id; // 라우트에서 :id를 사용하므로 req.params.id를 사용해야 합니다.
    const links = req.body.links;
    const updatedUser = await updateUserLinks(userId, links); // 여기서 함수 이름을 올바르게 사용합니다.

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res
      .status(200)
      .json({ message: 'Links updated successfully', data: updatedUser });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
