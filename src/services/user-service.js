const { User } = require('../db');

const addUser = async (userData) => {
    return User.create(userData);
};

const findUserById = async (id) => {
    return User.findById(id);
};

const modifyUser = async (id, userData) => {
    return User.findByIdAndUpdate(id, userData, { new: true });
};

const removeUser = async (id) => {
    await User.findByIdAndDelete(id);
};

module.exports = {
    addUser,
    findUserById,
    modifyUser,
    removeUser,
};
