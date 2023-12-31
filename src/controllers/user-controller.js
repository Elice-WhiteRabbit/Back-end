const userService = require('../services/user-service');

const addUser = async (req, res, next) => {
    const { name, email, password, generation_type, generation_number, roles } = req.body;

    const createdUser = await userService.addUser({
        name,
        email,
        password,
        generation_type,
        generation_number,
        roles
    });

    return res.status(201).json({
        message: "User created",
        data: createdUser,
    });
};

const findAllUser = async (req, res, next) => {
    const list = await userService.findAllUser();

    return res.status(200).json({
        message: "유저 전체 조회",
        data: list
    })
}

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

const findPublicUserInfoById = async (req, res, next) => {
    const { id } = req.params;
    let myId = req.tokenData && req.tokenData.id || null;

    const user = await userService.findPublicUserInfoById(id, myId);
    const userFollow = await userService.findAllFollowNumber(id);

    return res.status(200).json({
        message: "유저 기본정보 조회",
        user,
        following: userFollow.followingNumber,
        follower: userFollow.followerNumber
    });
}

const modifyUser = async (req, res, next) => {
    let id = "";
    if(req.params.id){
        id = req.params.id;
        await userService.userCheck(req.tokenData, id);
    }else{
        id = req.tokenData.id;
    }
    const userData = req.body;

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

    res.cookie('jwtToken', token, {
        httpOnly: true,
        maxAge: 12*60*60*1000
    });

    return res.status(200).json({
        message: "로그인 성공",
        token:token
    });
};

const logout = async (req, res, next) => {
    res.clearCookie('jwtToken');
    
    res.status(200).json({
        message: "로그아웃되었습니다"
    });
}

const sendCode = async (req, res, next) => {
    const { name, email } = req.body;

    await userService.sendCode({name, email})

    return res.status(200).json({
        message: "인증 코드 발송됨"
    });
}

const checkCode = async (req, res, next) => {
    const { email, code } = req.body;

    await userService.checkCode(email, code);

    return res.status(200).json({
        message: "인증이 완료되었습니다"
    })
}

const resetPassword = async (req, res, next) => {
    const { email, code, password } = req.body;

    await userService.resetPassword({
        email,
        code,
        password
    });

    return res.status(200).json({
        message: "비밀번호가 변경되었습니다"
    });
}

const addFollow = async (req, res, next) => {
    if(!req.tokenData.id){
        throw {
            message: "로그인이 필요합니다"
        }
    }

    const myId = req.tokenData.id;
    const { id } = req.params;

    const follow = await userService.addFollow({
        from: myId,
        to: id
    });

    return res.status(201).json({
        message: "팔로우 목록에 추가되었습니다",
        followId: follow._id
    });
}

const findAllFollowList = async (req, res, next) => {
    const { id } = req.params;
    
    let myId = req.tokenData && req.tokenData.id || null;

    const { followingUserList, followerUserList } = await userService.findAllFollow(id, myId);

    return res.status(200).json({
        message: "전체 팔로우 목록 조회입니다",
        following: followingUserList,
        follower: followerUserList
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

    await userService.removeFollowerById(id);

    return res.status(200).json({
        message: "팔로우가 삭제되었습니다"
    });
}

const removeFollowerByUserId = async (req, res, next) => {
    const myId = req.tokenData.id;
    const { id } = req.params;

    await userService.removeFollower(myId, id);

    return res.status(200).json({
        message: "팔로우가 삭제되었습니다"
    })
}

const checkEmailAvailable = async (req, res, next) => {
    const { email } = req.body;
    const check = await userService.checkEmailAvailable(email);

    if(check){
        res.status(200).json({
            message: "사용가능한 이메일입니다",
            isAvailable: true
        })
    } else {
        res.status(200).json({
            message: "이미 존재하는 이메일입니다",
            isAvailable: false
        })
    }
}

module.exports = {
    addUser,
    findUserById,
    findAllUser,
    modifyUser,
    removeUser,
    findUserByToken,
    findPublicUserInfoById,
    sendCode,
    checkCode,
    resetPassword,
    login,
    logout,
    addFollow,
    findAllFollowList,
    findAllFollowNumber,
    removeFollower,
    removeFollowerByUserId,
    checkEmailAvailable
};