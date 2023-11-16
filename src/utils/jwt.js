const jwt = require('jsonwebtoken');
require('dotenv').config();

const secretKey = process.env.JWT_SECRET_KEY;

const createToken = (payload) => {
    return jwt.sign(
        payload,
        secretKey,
        { expiresIn: '12h' }
    );
}

const verifyToken = (token) => {
    const data = jwt.verify(token, secretKey);
    return data;
}

module.exports = {
    createToken,
    verifyToken
};