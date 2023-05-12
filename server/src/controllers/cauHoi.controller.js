const { default: mongoose } = require("mongoose");
const cauHoiModel = require('../models/cauHoi.model');
const { validationResult } = require("express-validator");
const ObjectId = require('mongoose').Types.ObjectId;

class CauHoiController {
    constructor() {}

    getCauHoiById = async (req, res) => {
      try {
        let id = req.query.id

        if(!id){
          res.status(400).json({status:"false",data:[{
            type: "field",
            value: id,
            msg: "Thiếu id câu hỏi",
            path: "id",
            location: "query"
          }], message:"Thiếu id câu hỏi"})
          return
        }

        if(!ObjectId.isValid(id)){
          res.status(400).json({status:"false",data:[{
            type: "field",
            value: id,
            msg: "Id phải ở định dạng Mongo Object Id",
            path: "id",
            location: "query"
          }], message:"Id phải ở định dạng Mongo Object Id"})
          return
        } 
        
        let result = await cauHoiModel.getById(id)

        if(!result){
          res.status(404).json({status:"false", message:`Không tìm thấy câu hỏi với id: ${id}`})
          return
        } else {
          res.status(200).json({status:"true", data:result, message:`Tìm câu hỏi thành công`})
          return
        }

      } catch (error) {
        console.log(error);
        res.status(400).json({status:"false",data:{
          errorName: error.name,
          errorMsg : error.message
        }, message:"Lỗi khi tìm câu hỏi"})
        return
      }
    }

    createCauHoi = async (req, res) => {
      try {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
          res.status(400).json({ status:"false", data: errors.array(), message:"Lỗi khi tạo câu hỏi" });
          return
        }

        let data = req.body

        let result = await cauHoiModel.create(data)
        res.status(200).json({status:"true", data:result, message:"Tạo câu hỏi thành công"})
        return
      } catch (error) {
        console.log(error);
        res.status(400).json({status:"false",data:{
          errorName: error.name,
          errorMsg : error.message
        }, message:"Lỗi khi tạo câu hỏi"})
        return
      }
    }

    updateCauHoi = async (req, res) => {
      try {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
          res.status(400).json({ status:"false", data: errors.array(), message:"Lỗi khi cập nhật vị trí" });
          return
        }

        let id = req.body.id
        let data = req.body.data
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

        let result = await cauHoiModel.update(id, data)
        res.status(200).json({status:"true", data:result, message:"Cập nhật câu hỏi thành công"})
        return
      } catch (error) {
        console.log(error);
        res.status(400).json({status:"false",data:{
          errorName: error.name,
          errorMsg : error.message
        }, message:"Lỗi khi cập nhật câu hỏi"})
        return
      }
    }

    deleteCauHoi = async (req, res) => {
      try {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
          res.status(400).json({ status:"false", data: errors.array(), message:"Lỗi khi xóa câu hỏi" });
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
        
        let result = await cauHoiModel.delete(id)
        res.status(200).json({status:"true", data:result, message:"Xóa câu hỏi thành công"})
        return
      } catch (error) {
        console.log(error);
        res.status(400).json({status:"false",data:{
          errorName: error.name,
          errorMsg : error.message
        }, message:"Lỗi khi xóa câu hỏi"})
        return
      }
    }
  }

module.exports = new CauHoiController();