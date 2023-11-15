const userService = require('../services/user-service');

const addUser = async (req, res, next) => {
    const { name, email, password, profile_url, roles, isCoach } = req.body;

    const createdUser = await userService.addUser({
        name,
        email,
        password,
        profile_url,
        roles,
        isCoach,
    });

    res.status(201).json({
        message: "User created",
        data: createdUser,
    });
};

const findUserById = async (req, res, next) => {
    const { id } = req.params;

    const user = await userService.findUserById(id);

    res.status(200).json({
        message: "User details",
        data: user,
    });
};

const modifyUser = async (req, res, next) => {
    const { id } = req.params;
    const userData = req.body;

    const updatedUser = await userService.modifyUser(id, userData);

    res.status(200).json({
        message: "User updated",
        data: updatedUser,
    });
};

const removeUser = async (req, res, next) => {
    const { id } = req.params;

    await userService.removeUser(id);

    res.status(200).json({
        message: "User deleted",
    });
};

module.exports = {
    addUser,
    findUserById,
    modifyUser,
    removeUser,
};