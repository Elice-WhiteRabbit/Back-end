const { User } = require('../db');

const updateUserLinks = async (userId, links) => {
  return await User.findByIdAndUpdate(
    userId,
    { $push: { links: links } },
    { new: true }
  );
};

const deleteUserLink = async (userId, linkToDelete) => {
  return await User.findByIdAndUpdate(
    userId,
    { $pull: { links: linkToDelete } },
    { new: true }
  );
};

const getUserLinks = async (userId) => {
  const user = await User.findById(userId).select('links');
  return user ? user.links : null;
};

module.exports = {
  updateUserLinks,
  deleteUserLink,
  getUserLinks,
};
