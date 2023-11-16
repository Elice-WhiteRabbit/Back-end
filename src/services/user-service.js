const { User } = require('../db');
const bcrypt = require('bcrypt');
const { createToken } = require('../utils/jwt');

const addUser = async (userData) => {
    userData.password = await bcrypt.hash(userData.password, 10);

    return User.create(userData);
};

const findUserById = async (id) => {
    return User.findById(id);
};

const modifyUser = async (id, userData) => {
    if(userData.password){
        userData.password = await bcrypt.hash(userData.password, 10);
    }

    return User.findByIdAndUpdate(id, userData, { new: true });
};

const removeUser = async (id) => {
    await User.findByIdAndDelete(id);
};

const login = async (data) => {
    const { email, password } = data;

    const user = await User.findOne({ email });

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

        const token = createToken({
            email: user.email,
            id: user._id,
            roles:user.roles
        });

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