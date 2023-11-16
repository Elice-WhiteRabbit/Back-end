const { verifyToken } = require('../utils/jwt');

const auth = (req, res, next) => {
    try{
        // 이후로 req.tokenData에서 payload 정보 접근 가능
        req.tokenData = verifyToken(req.headers.authorization.split(' ')[1]);
        return next();
    } catch(err) {
        if(err.name === "TokenExpiredError"){
            throw {
                status:401,
                message:"토큰이 만료되었습니다"
            };
        }else if(err.name === "JsonWebTokenError"){
            throw {
                status:401,
                message:"유효하지 않은 토큰입니다"
            };
        }else{
            next(err);
        }
    }
}

const checkUser = (req, res, next) => {
    try{
        const { id } = req.params;
        console.log(id);
        // 본인이거나 관리자인 경우 접근 가능
        if((id !== req.tokenData.id) && (req.tokenData.roles !== "Admin")){
            throw {
                status:401,
                message: "접근 권한이 없습니다"
            }
        }

        return next();
    } catch(err) {
        next(err);
    }
}

module.exports = {
    auth,
    checkUser
}