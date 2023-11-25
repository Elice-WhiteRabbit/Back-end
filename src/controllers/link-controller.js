const {
  updateUserLinks,
  deleteUserLink,
  getUserLinks,
  addLink,
} = require('../services/link-service');

exports.updateLinks = async (req, res) => {
  try {
    const userId = req.params.id;
    const { linkId, title, url } = req.body;

    const updatedUser = await updateUserLinks(userId, linkId, title, url);

    if (!updatedUser) {
      return res
        .status(404)
        .json({ message: 'User not found or link not found' });
    }

    res
      .status(200)
      .json({ message: 'Link updated successfully', data: updatedUser });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteLink = async (req, res) => {
  try {
    const userId = req.params.id;
    const { title, url } = req.body;

    const updatedUser = await deleteUserLink(userId, title, url);

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

exports.addLink = async (req, res) => {
  try {
    const userId = req.params.id;
    const { title, url } = req.body;

    const updatedUser = await addLink(userId, title, url);

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res
      .status(200)
      .json({ message: 'Link added successfully', data: updatedUser });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
