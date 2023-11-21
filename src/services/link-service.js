const { User } = require('../db');

const updateUserLinks = async (userId, links) => {
  return await User.findByIdAndUpdate(
    userId,
    { $push: { links: links } },
    { new: true }
  );
};

module.exports = {
  updateUserLinks,
};
