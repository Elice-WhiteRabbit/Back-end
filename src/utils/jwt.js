const jwt = require('jsonwebtoken');
require('dotenv').config();

const secretKey = process.env.JWT_SECRET_KEY;

const createToken = (email, isAdmin) => {
    return jwt.sign(
        { email, isAdmin },
        secretKey,
        { expiresIn: '12h' }
    );
}

const verifyToken = (token) => {
    return jwt.verify(token, secretKey);
}

module.exports = {
    createToken,
    verifyToken
};