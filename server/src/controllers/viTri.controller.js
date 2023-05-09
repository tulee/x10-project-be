const { validationResult } = require('express-validator');
const viTriModel = require('../models/viTri.model');
const { default: mongoose } = require("mongoose");
const ObjectId = require('mongoose').Types.ObjectId;

class ViTriController {
    constructor() {}

    getViTri = async (req, res) => {
      let term = req.query.term
      let perPage = 3;
      let page = req.query.page || 1; 
      let result = await viTriModel.getViTri(term,page, perPage)
      if(result.totalPages>0){
        res.send({status:"true", data: result, message:"Tìm vị trí thành công"})
      } else {
        res.status(404).json({status:"false", message:"Không tìm thấy đợt tuyển dụng"})
        return
      }
    }

    createViTri = async (req,res) => {
      try {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
          res.status(400).json({ status:"false", data: errors.array(), message:"Lỗi khi tạo vị trí" });
          return
        }

        let data = req.body
        let ma_vi_tri = data.ma_vi_tri
        let checkExisting = await viTriModel.getViTriByMaViTri(ma_vi_tri)
        if(checkExisting){
          res.status(400).json({status:"false",data:[{
              type: "field",
              value: ma_vi_tri,
              msg: "Mã vị trí đã tồn tại",
              path: "ma_vi_tri",
              location: "body"
            }], message:"Mã vị trí đã tồn tại"})
          return
        }

        let result = await viTriModel.create(data)
        res.status(200).json({status:"true", data:result, message:"Tạo vị trí thành công"})
        return

      } catch (error) {
        console.log(error);
          res.status(400).json({status:"false",data:{
            errorName: error.name,
            errorMsg : error.message
          }, message:"Lỗi khi tạo bài test"})
          return
      }
    }

    deleteViTri = async (req, res) => {
      try {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
          res.status(400).json({ status:"false", data: errors.array(), message:"Lỗi khi xóa vị trí" });
          return
        }

        let id = req.body.id
        if(!ObjectId.isValid(id)){
          res.status(400).json({status:"false",data:[{
            type: "field",
            value: id,
            msg: "Id phải ở định dạng Mongo Object Id",
            path: "id",
            location: "body"
          }], message:"Id phải ở định dạng Mongo Object Id"})
          return
        }

        let result = await viTriModel.delete(id)
        res.status(200).json({status:"true", data:result, message:"Xóa vị trí thành công"})
        return
      } catch (error) {
        console.log(error);
        res.status(400).json({status:"false",data:{
          errorName: error.name,
          errorMsg : error.message
        }, message:"Lỗi khi xóa vị trí"})
        return
      }
    }
  }

module.exports = new ViTriController();