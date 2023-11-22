const { User } = require("../db");
const { Follow } = require('../db')
const { createToken } = require("../utils/jwt");
const { deleteImage } = require("../utils/image-to-url");
const createCode = require('../utils/code-creater');
const authCodeCache = require('../utils/node-cache');
const mailer = require('../utils/mailer');

const addUser = async (userData) => {
    const check = await User.findOne({ email:userData.email });
    
    if(check){
        throw {
            status: 409,
            message: "이미 존재하는 이메일입니다"
        }
    }

  return User.create(userData);
};

const findAllUser = async () => {
  return User.find({});
};

const findUserById = async (id) => {
  return User.findById(id);
};

const modifyUser = async (id, userData) => {
  const user = await User.findById(id);

    if(userData.profile_url && user.profile_url){
        await deleteImage(user.profile_url);
    }

  return User.findByIdAndUpdate(id, userData, { new: true });
};

const removeUser = async (id) => {
  const user = await User.findById(id);

  if (user.profile_url) {
    await deleteImage(user.profile_url);
  }

  await User.findByIdAndDelete(id);
};

const login = async (data) => {
  const { email, password } = data;

  const user = await User.findOne({ email });

  if (!user) {
    throw {
      status: 401,
      message: "존재하지 않는 이메일입니다",
    };
  } else {
    const isEqual = await bcrypt.compare(password, user.password);
    if (!isEqual) {
      throw {
        status: 401,
        message: "비밀번호가 틀렸습니다",
      };
    }

    const token = createToken({
      email: user.email,
      id: user._id,
      roles: user.roles,
    });

    return token;
  }
};

// 접근한 토큰과 접근하는 DB의 _id를 받아서 접근권한이 있는지 확인하는 함수
const userCheck = async (tokenData, id) => {
  if((tokenData.id !== id) && (tokenData.roles !== "Admin")){
    throw {
        status: 401,
        message: "접근 권한이 없습니다"
    }
}
}

const sendCode = async (email) => {
  const check = await User.findOne({ email });

  if(!check){
      throw {
          status: 404,
          message: "등록되지 않은 이메일입니다"
      }
  }

  const prevCode = authCodeCache.get(email);
  if(prevCode){
      authCodeCache.del(email);
  }

  const authCode = createCode();

  authCodeCache.set(email,authCode,60);
  await mailer(email,authCode);

  return;
}

const resetPassword = async (data) => {
  const { email, authCode, password } = data;

  const check = authCodeCache.get(email);
  if(!check || authCode !== check){
      throw {
          status: 404,
          message: "기간이 만료되었거나 잘못된 인증번호입니다"
      }
  }

  await User.findOneAndUpdate(
      { email },
      {password}
  );
  
  authCodeCache.del(email);

  return;
}

const addFollow = async (from, to) => {
  return Follow.create({ from, to });
}

const findAllFollow = async (id) => {
  const followingList = await Follow.find({ from: id });
  const followerList = await Follow.find({ to: id });

  return {
    followingList,
    followerList
  }
}

const findAllFollowNumber = async (id) => {
  const followingList = await Follow.find({ from: id });
  const followerList = await Follow.find({ to: id });

  const followingNumber = followingList.length;
  const followerNumber = followerList.length;

  return {
    followingNumber,
    followerNumber
  }
}

const findFollowingList = async (id) => {
  return Follow.find({ from: id });
}

const findFollowerList = async (id) => {
  return Follow.find({ to: id });
}

const removeFollower = async (from, to) => {
  return Follow.findOneAndDelete({from, to});
}

const unFollow = async (from, to) => {
  return Follow.findOneAndDelete({from, to});
}

module.exports = {
  addUser,
  findAllUser,
  findUserById,
  modifyUser,
  removeUser,
  login,
  userCheck,
  sendCode,
  resetPassword,
  addFollow,
  findAllFollow,
  findAllFollowNumber,
  findFollowingList,
  findFollowerList,
  removeFollower,
  unFollow
};
