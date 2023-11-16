const { verifyToken } = require('../utils/jwt');

const auth = (req, res, next) => {
    try{
        req.tokenData = verifyToken(req.headers.authorization);
        return next();
    } catch(err) {
        if(err.name === "TokenExpiredError"){
            throw {
                status:401,
                message:"토큰이 만료되었습니다"
            }
        }else if(err.name === "JsonWebTokenError"){
            throw {
                status:401,
                message:"유효하지 않은 토큰입니다"
            }
        }else{
            throw err;
        }
    }
}

module.exports = auth;