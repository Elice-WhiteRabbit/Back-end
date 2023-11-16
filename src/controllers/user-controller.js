const userService = require('../services/user-service');

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
    login,
}