const cbnvModel = require('../models/cbnv.model');
const randToken = require('rand-token');
const { default: mongoose } = require("mongoose");
const bcrypt = require('bcrypt');
const {SALT_ROUNDS} = require('../variables/auth.variable');
const authService = require('../services/auth.service');
const jwtVariable = require('../variables/jwt.variable');

class AuthController {
    constructor() {}

    register = async (req,res) => {
      const username = req.body.username.toLowerCase()
	    const cbnv = await cbnvModel.getCbnvByUsername(username)

      if(cbnv){
        res.send({status:"false", message:"Tên tài khoản đã tồn tại"})
      } else {
        const hashPassword = bcrypt.hashSync(req.body.password, SALT_ROUNDS);
        const newCbnv = {
          username: username,
          password: hashPassword,
        }

        const createdCbnv = await cbnvModel.create(newCbnv)

        if(!createdCbnv){
          return res.send({status:"false", message:"Có lỗi trong quá trình tạo tài khoản, vui lòng thử lại"})
        } else {
          return res.send({status:"true",data:username, message:"Tạo tài khoản thành công"})
        }

      }
    }

    login = async (req,res) => {
      const username = req.body.username.toLowerCase() || 'test';
	    const password = req.body.password || '12345';

      const cbnv = await cbnvModel.getCbnvByUsername(username)
      if(!cbnv){
        res.send({status:"false", message:"Tên đăng nhập không tồn tại"})
      }

      const isPasswordValid = bcrypt.compareSync(password, cbnv.password);
      if (!isPasswordValid) {
        res.send({status:"false", message:"Mật khẩu không chính xác"})
      }

      const accessTokenLife =
      process.env.ACCESS_TOKEN_LIFE || jwtVariable.accessTokenLife;
      const accessTokenSecret =
        process.env.ACCESS_TOKEN_SECRET || jwtVariable.accessTokenSecret;

      const dataForAccessToken = {
        username: cbnv.username,
      };

      const accessToken = await authService.generateToken(
        dataForAccessToken,
        accessTokenSecret,
        accessTokenLife,
      )

      if (!accessToken) {
        return res.send({status:"false", message:"Đăng nhập không thành công, vui lòng thử lại"});
      }

	    let refreshToken = randToken.generate(jwtVariable.refreshTokenSize)

      if (!cbnv.refreshToken) {
        await cbnvModel.updateCbnvByUsername(cbnv.username, {refreshToken: refreshToken});
      } else {
        refreshToken = cbnv.refreshToken;
      }

      res.send({
        status:"true",
        message:"Đăng nhập thành công",
        data:{
          accessToken,
          refreshToken,
          cbnv,
        }
      })
    }

    refreshToken = async (req,res) => {
      const accessTokenFromHeader = req.headers.x_authorization;
      if (!accessTokenFromHeader) {
        return res.send({status:"false", message:"Không tìm thấy access token"})
      }

      const refreshTokenFromBody = req.body.refreshToken;
      if (!refreshTokenFromBody) {
        return res.send({status:"false", message:"Không tìm thấy refresh token"})
      }

      console.log(refreshTokenFromBody);

      const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET || jwtVariable.accessTokenSecret;
      const accessTokenLife = process.env.ACCESS_TOKEN_LIFE || jwtVariable.accessTokenLife;

      // Decode access token
      const decoded = await authService.decodeToken(
        accessTokenFromHeader,
        accessTokenSecret,
      )
      if (!decoded) {
        return res.send({status:"false", message:"Access token không hợp lệ"})
      }

      const username = decoded.payload.username; // Lấy username từ payload

      const cbnv = await cbnvModel.getCbnvByUsername(username)
      if(!cbnv){
        res.send({status:"false", message:"User không tồn tại"})
      }

      console.log(cbnv);

      if (refreshTokenFromBody !== cbnv.refreshToken) {
        return res.send({status:"false", message:"Refresh token không hợp lệ"});
      }

      // Tạo access token mới
      const dataForAccessToken = {
        username,
      };

      const accessToken = await authService.generateToken(
        dataForAccessToken,
        accessTokenSecret,
        accessTokenLife,
      );

      if (!accessToken) {
        return res.send({status:"false", message:"Tạo access token không thành công, vui lòng thử lại"});
      }

      return res.send({status:"true", message:"Thành công", data: {accessToken}})
    }
  }

module.exports = new AuthController();