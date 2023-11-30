const { User, Generation } = require('../db');
const { Follow } = require('../db');
const bcrypt = require('bcrypt');
const { createToken } = require('../utils/jwt');
const { deleteImage } = require('../utils/image-to-url');
const createCode = require('../utils/code-creater');
const authCodeCache = require('../utils/node-cache');
const mailer = require('../utils/mailer');

const addUser = async (userData) => {
  const check = await User.findOne({ email: userData.email });

  if (check) {
    throw {
      status: 409,
      message: '이미 존재하는 이메일입니다',
    };
  }

  const hashedPassword = await bcrypt.hash(userData.password, 10);
  userData.password = hashedPassword;

  const generation = await Generation.findOne({
    type: userData.generation_type,
    number: userData.generation_number
  })

  return User.create({
    name: userData.name,
    email: userData.email,
    password: userData.password,
    roles: userData.roles,
    generation: generation._id
  });
};

const findAllUser = async () => {
  return User.find({}).populate('generation');
};

const findUserById = async (id) => {
  const user = await User.findById(id).populate('skills').populate('generation');
  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    profile_url: user.profile_url,
    generation_type: user.generation.type,
    generation_number: user.generation.number,
    roles: user.roles,
    is_coach: user.is_coach,
    links: user.links,
    skills: user.skills,
  }
};

const findPublicUserInfoById = async (id) => {
  const user = await User.findById(id).populate('skills').populate('generation');
  return {
    name: user.name,
    email: user.email,
    profile_url: user.profile_url,
    generation_type: user.generation.type,
    generation_number: user.generation.number,
    roles: user.roles,
    links: user.links,
    skills: user.skills,
  };
};

const modifyUser = async (id, userData) => {
  const user = await User.findById(id).populate('generation');

  if (userData.profile_url && user.profile_url) {
    await deleteImage(user.profile_url);
  }

  if (userData.password) {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    userData.password = hashedPassword;
  }

  const generation = await Generation.findOne({
    type: userData.generation_type || user.generation.type,
    number: userData.generation_number || user.generation.number
  })

  const { generation_number, generation_type, ...rest } = userData;
  const data = { ...rest, generation:generation._id };

  return User.findByIdAndUpdate(id, data, { new: true });
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
      message: '존재하지 않는 이메일입니다',
    };
  } else {
    const isEqual = await bcrypt.compare(password, user.password);
    if (!isEqual) {
      throw {
        status: 401,
        message: '비밀번호가 틀렸습니다',
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
  if (tokenData.id !== id && tokenData.roles !== 'ADMIN') {
    throw {
      status: 401,
      message: '접근 권한이 없습니다',
    };
  }
};

const sendCode = async (data) => {
  const { name, email } = data;
  const check = await User.findOne({ name, email });

  if (!check) {
    throw {
      status: 404,
      message: '등록되지 않은 사용자입니다',
    };
  }

  const prevCode = authCodeCache.get(email);
  if (prevCode) {
    authCodeCache.del(email);
  }

  const authCode = createCode();

  authCodeCache.set(email, authCode, 600);
  await mailer(email, authCode);

  return;
};

const checkCode = async (email, code) => {
  const check = authCodeCache.get(email);
  if (!check || code !== check) {
    throw {
      status: 404,
      message: '기간이 만료되었거나 잘못된 인증번호입니다',
    };
  }

  authCodeCache.set(code, true, 60 * 60);

  return;
};

const resetPassword = async (data) => {
  const { email, code, password } = data;

  const check = authCodeCache.get(code);
  if (!check) {
    throw {
      message: '기간이 만료되었습니다',
    };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await User.findOneAndUpdate({ email }, { password: hashedPassword });

  authCodeCache.del(email);
  authCodeCache.del(code);

  return;
};

const addFollow = async (data) => {
  const { from, to } = data;
  if(from === to){
    throw {
      message: "본인을 팔로우할 수 없습니다"
    }
  }
  const check = await Follow.findOne({from, to});
  if(check){
    throw {
      message: "이미 팔로우중인 유저입니다"
    }
  }

  return Follow.create({ from, to });
};

const findAllFollow = async (id, myId) => {
  const followingList = await Follow.find({ from: id }).populate({
    path: 'to',
    populate: {
      path: 'generation'
    },
    select: '_id name profile_url generation roles',
  });
  const followerList = await Follow.find({ to: id }).populate({
    path: 'from',
    populate: {
      path: 'generation'
    },
    select: '_id name profile_url generation roles',
  });

  const followingUserList = [];
  const followerUserList = [];

  for(const obj of followingList){
    if (!obj.to) {
      continue;
    }
    let is_follow = false
    if(myId){
      const check = await Follow.findOne({ from:myId, to:obj.to._id })
      if(check){
        is_follow = true
      }
    }
    const {
      _id,
      name,
      profile_url,
      generation,
      roles,
    } = obj.to;
    const newObj = {
      _id,
      name,
      profile_url,
      generation_type: generation.type,
      generation_number: generation.number,
      roles,
      followId: obj._id,
      is_follow
    };
    followingUserList.push(newObj);
  }

  for(const obj of followerList){
    if (!obj.from) {
      continue;
    }
    let is_follow = false
    if(myId){
      const check = await Follow.findOne({ from:myId, to:obj.from._id })
      if(check){
        is_follow = true
      }
    }
    const {
      _id,
      name,
      profile_url,
      generation,
      roles,
    } = obj.from;
    const newObj = {
      _id,
      name,
      profile_url,
      generation_type: generation.type,
      generation_number: generation.number,
      roles,
      followId: obj._id,
      is_follow
    };
    followerUserList.push(newObj);
  }

  return {
    followingUserList,
    followerUserList,
  };
};

const findAllFollowNumber = async (id) => {
  const followingList = await Follow.find({ from: id });
  const followerList = await Follow.find({ to: id });

  const followingNumber = followingList.length;
  const followerNumber = followerList.length;

  return {
    followingNumber,
    followerNumber,
  };
};

const findFollowById = async (id) => {
  return Follow.findById(id);
};

const findFollowingList = async (id) => {
  return Follow.find({ from: id });
};

const findFollowerList = async (id) => {
  return Follow.find({ to: id });
};

const removeFollowerById = async (id) => {
  return Follow.findByIdAndDelete(id);
};

const removeFollower = async (from, to) => {
  return Follow.deleteMany({ from, to });
};

module.exports = {
  addUser,
  findAllUser,
  findUserById,
  findPublicUserInfoById,
  modifyUser,
  removeUser,
  login,
  userCheck,
  sendCode,
  checkCode,
  resetPassword,
  addFollow,
  findAllFollow,
  findAllFollowNumber,
  findFollowById,
  findFollowingList,
  findFollowerList,
  removeFollower,
  removeFollowerById,
};
