const cbnvModel = require("../models/cbnv.model");
const authService = require("../services/auth.service");

class AuthMiddleware {
    isAuth = async (req, res, next) => {
        // Lấy access token từ header
        const accessTokenFromHeader = req.headers.x_authorization;
        if (!accessTokenFromHeader) {
            return res.send({status:"false",message:"Không tìm thấy access token"});
        }
    
        const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
    
        const verified = await authService.verifyToken(
            accessTokenFromHeader,
            accessTokenSecret,
        );
        if (!verified) {
            return res.send({status:"false",message:"Bạn không có quyền truy cập vào tính năng này"})
        }
    
        const cbnv = await cbnvModel.getCbnvByUsername(verified.payload.username);
        req.cbnv = cbnv;
    
        return next();
    };
  }

module.exports = new AuthMiddleware();