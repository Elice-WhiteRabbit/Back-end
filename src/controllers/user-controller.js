const userService = require('../services/user-service');

const addUser = async (req, res, next) => {
    const { name, email, password, generation_type, generation_number } = req.body;

    const createdUser = await userService.addUser({
        name,
        email,
        password,
        generation_type,
        generation_number
    });

    res.status(201).json({
        message: "User created",
        data: createdUser,
    });
};

const findUserById = async (req, res, next) => {
    const { id } = req.params;

    await userService.userCheck(req.tokenData, id);

    const user = await userService.findUserById(id);
    console.log("check3");
    res.status(200).json({
        message: "User details",
        data: user,
    });
};

const modifyUser = async (req, res, next) => {
    const { id } = req.params;
    const userData = req.body;

    await userService.userCheck(req.tokenData, id);

    const updatedUser = await userService.modifyUser(id, userData);

    res.status(200).json({
        message: "User updated",
        data: updatedUser,
    });
};

const removeUser = async (req, res, next) => {
    const { id } = req.params;

    await userService.userCheck(req.tokenData, id);

    await userService.removeUser(id);

    res.status(200).json({
        message: "User deleted",
    });
};

const login = async (req, res, next) => {
    const { email, password } = req.body;

    const token = await userService.login({
        email,
        password
    });

    res.status(200).json({
        message: "로그인 성공",
        token:token
    });
};

module.exports = {
    addUser,
    findUserById,
    modifyUser,
    removeUser,
    login
};