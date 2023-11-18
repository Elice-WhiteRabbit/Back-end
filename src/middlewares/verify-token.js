const { verifyToken } = require("../utils/jwt");

const auth = async (req, res, next) => {
  try {
    if (!req.headers.authorization) {
      throw {
        status: 401,
        message: "Authorization header 이 없습니다",
      };
    }
    //헤더 없을 때 에러 핸들링 추가(11.18 - 수빈)

    // 이후로 req.tokenData에서 payload 정보 접근 가능
    req.tokenData = verifyToken(req.headers.authorization.split(" ")[1]);

    return next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      throw {
        status: 401,
        message: "토큰이 만료되었습니다",
      };
    } else if (err.name === "JsonWebTokenError") {
      throw {
        status: 401,
        message: "유효하지 않은 토큰입니다",
      };
    } else {
      next(err);
    }
  }
};

const checkAdmin = async (req, res, next) => {
  try {
    if (req.tokenData.roles !== "Admin") {
      throw {
        status: 401,
        message: "접근 권한이 없습니다",
      };
    }

    return next();
  } catch (err) {
    next(err);
  }
};

module.exports = {
  auth,
  checkAdmin,
};
