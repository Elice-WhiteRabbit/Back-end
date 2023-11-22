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

    return res.status(201).json({
        message: "User created",
        data: createdUser,
    });
};

const findUserByToken = async (req, res, next) => {
    const id = req.tokenData.id;
    const user = await userService.findUserById(id);

    return res.status(200).json({
        message: "유저 정보 조회",
        data: user
    });
}

const findUserById = async (req, res, next) => {
    const { id } = req.params;

    await userService.userCheck(req.tokenData, id);

    const user = await userService.findUserById(id);

    return res.status(200).json({
        message: "User details",
        data: user,
    });
};

const modifyUser = async (req, res, next) => {
    const { id } = req.params;
    const userData = req.body;

    await userService.userCheck(req.tokenData, id);

    const updatedUser = await userService.modifyUser(id, userData);

    return res.status(200).json({
        message: "User updated",
        data: updatedUser,
    });
};

const removeUser = async (req, res, next) => {
    const { id } = req.params;

    await userService.userCheck(req.tokenData, id);

    await userService.removeUser(id);

    return res.status(200).json({
        message: "User deleted",
    });
};

const login = async (req, res, next) => {
    const { email, password } = req.body;

    const token = await userService.login({
        email,
        password
    });

    return res.status(200).json({
        message: "로그인 성공",
        token:token
    });
};

const sendCode = async (req, res, next) => {
    const { email } = req.body;

    await userService.sendCode(email)

    return res.status(200).json({
        message: "인증 코드 발송됨"
    });
}

const resetPassword = async (req, res, next) => {
    const { email, authCode, password } = req.body;

    await userService.resetPassword({
        email,
        authCode,
        password
    });

    return res.status(200).json({
        message: "비밀번호가 변경되었습니다."
    });
}

const addFollow = async (req, res, next) => {
    const { id } = req.params;
    const { to } = req.body;

    await userService.userCheck(req.tokenData, id);

    await userService.addFollow(id, to);

    return res.status(201).json({
        message: "팔로우 목록에 추가되었습니다"
    });
}

const findAllFollowList = async (req, res, next) => {
    const { id } = req.params;

    const list = await userService.findAllFollow(id);

    return res.status(200).json({
        message: "전체 팔로우 목록 조회입니다",
        data: list
    });
}

const findAllFollowNumber = async (req, res, next) => {
    const { id } = req.params;

    const numbers = await userService.findAllFollowNumber(id);

    return res.status(200).json({
        message: "전체 팔로우 수 조회입니다",
        data: numbers
    });
}

const removeFollower = async (req, res, next) => {
    const { id } = req.params;
    const { from, to } = req.query;

    await userService.userCheck(req.tokenData, id);

    if(from){
        await userService.removeFollower(from, id);

        return res.status(200).json({
            message: "팔로우가 취소되었습니다"
        });
    }else if(to){
        await userService.removeFollower(id, to);
    
        return res.status(200).json({
            message: "팔로우가 취소되었습니다"
        });
    }
}

module.exports = {
    addUser,
    findUserById,
    modifyUser,
    removeUser,
    findUserByToken,
    sendCode,
    resetPassword,
    login,
    addFollow,
    findAllFollowList,
    findAllFollowNumber,
    removeFollower,
};