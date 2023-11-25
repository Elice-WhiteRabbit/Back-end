const { User } = require('../db');

const updateUserLinks = async (userId, linkId, title, url) => {
  return await User.findOneAndUpdate(
    { _id: userId, 'links._id': linkId },
    { $set: { 'links.$.title': title, 'links.$.url': url } },
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

const addLink = async (userId, title, url) => {
  return await User.findByIdAndUpdate(
    userId,
    { $push: { links: { title, url } } },
    { new: true }
  );
};

module.exports = {
  updateUserLinks,
  deleteUserLink,
  getUserLinks,
  addLink,
};
