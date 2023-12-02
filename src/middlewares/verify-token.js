const { verifyToken } = require("../utils/jwt");

const setToken = async (req, res, next) => {
  try{
    if (!req.cookies.jwtToken) {
      req.tokenData = null;
      return next()
    } else {
      req.tokenData = verifyToken(req.cookies.jwtToken);
      return next()
    }
  } catch(err) {
    next(err);
  }
}

const auth = async (req, res, next) => {
  try {
    if (!req.cookies.jwtToken) {
      throw {
        status: 400,
        message: "jwt 토큰이 필요합니다",
      };
    }

    // 이후로 req.tokenData에서 payload 정보 접근 가능
    req.tokenData = verifyToken(req.cookies.jwtToken);

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
    if (req.tokenData.roles !== "ADMIN") {
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
  setToken,
};
