const { User } = require('../db');
const bcrypt = require('bcrypt');
const { createToken } = require('../utils/jwt');

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

const login = async (data) => {
    const { email, password } = data;

    const user = await User.find({ email });
    if(!user){
        throw {
            status: 401,
            message: "존재하지 않는 이메일입니다"
        }
    }else{
        const isEqual = await bcrypt.compare(password, user.password);
        if(!isEqual){
            throw {
                status: 401,
                message: "비밀번호가 틀렸습니다"
            }
        }
        const token = createToken(user.email, user.isAdmin);

        return token;
    }
}

module.exports = {
    addUser,
    findUserById,
    modifyUser,
    removeUser,
    login
};