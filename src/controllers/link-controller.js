const {
  updateUserLinks,
  deleteUserLink,
  getUserLinks,
} = require('../services/link-service');

exports.updateLinks = async (req, res) => {
  try {
    const userId = req.params.id; // 라우트에서 :id를 사용하므로 req.params.id를 사용해야 합니다.
    const links = req.body.links;
    const updatedUser = await updateUserLinks(userId, links);

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

exports.deleteLink = async (req, res) => {
  try {
    const userId = req.params.id;
    const linkToDelete = req.body.links; // 삭제할 링크

    const updatedUser = await deleteUserLink(userId, linkToDelete);

    if (!updatedUser) {
      return res
        .status(404)
        .json({ message: 'User not found or link not found' });
    }

    res
      .status(200)
      .json({ message: 'Link deleted successfully', data: updatedUser });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getLinks = async (req, res) => {
  try {
    const userId = req.params.id;

    const links = await getUserLinks(userId);

    if (!links) {
      return res.status(404).json({ message: 'User not found or no links' });
    }

    res.status(200).json({ data: links });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
