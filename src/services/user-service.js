const { User } = require('../db');
const bcrypt = require('bcrypt');
const { createToken } = require('../utils/jwt');

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
    login
};