const baiTestDauVaoModel = require('../models/baiTestDauVao.model');
const ungVienModel = require('../models/ungVien.model');
const yeuCauUngTuyenModel = require('../models/yeuCauUngTuyen.model');
const model = require('../models/baiTestDauVao.model');
const { default: mongoose } = require("mongoose");
const { validationResult } = require('express-validator');
const ObjectId = require('mongoose').Types.ObjectId;

class BaiTestDauVaoController {
    constructor() {}

    createBaiTest = async(req,res) => {
      try {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
          res.status(400).json({ status:"false", data: errors.array(), message:"Lỗi khi tạo bài test" });
          return
        }

        let data = req.body
        let ma_bai_test = data.ma_bai_test
        let checkExisting = await baiTestDauVaoModel.getBaiTestByMaBaiTest(ma_bai_test)
        if(checkExisting){
          res.status(400).json({status:"false",data:[{
              type: "field",
              value: ma_bai_test,
              msg: "Mã bài test đã tồn tại",
              path: "ma_bai_test",
              location: "body"
            }], message:"Mã bài test đã tồn tại"})
          return
        }

        data.ngay_tao_bai_test = new Date()
        data.ngay_chinh_sua_gan_nhat = new Date()

        let result = await baiTestDauVaoModel.create(data)
        res.status(200).json({status:"true", data:result, message:"Tạo bài test thành công"})
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

    deleteBaiTest = async(req,res) => {
      try {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
          res.status(400).json({ status:"false", data: errors.array(), message:"Lỗi khi xóa bài test" });
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

        let result = await baiTestDauVaoModel.delete(id)
        res.status(200).json({status:"true", data:result, message:"Xóa bài test thành công"})
        return
      } catch (error) {
          console.log(error);
            res.status(400).json({status:"false",data:{
              errorName: error.name,
              errorMsg : error.message
            }, message:"Lỗi khi xóa bài test"})
            return
        }
    }

    updateBaiTest = async(req,res) => {
      try {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
          res.status(400).json({ status:"false", data: errors.array(), message:"Lỗi khi cập nhật bài test" });
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

        let result = await baiTestDauVaoModel.update(id, data)
        res.status(200).json({status:"true", data:result, message:"Cập nhật bài test thành công"})
        return
      } catch (error) {
          console.log(error);
            res.status(400).json({status:"false",data:{
              errorName: error.name,
              errorMsg : error.message
            }, message:"Lỗi khi cập nhật bài test"})
            return
        }
    }

    getBaiTest = async (req, res) => {
        try {
          let term = req.query.term
          let viTri = req.query.vitri
          if(viTri){
            if(!ObjectId.isValid(viTri)){
              res.status(400).json({status:"false",data:[{
                type: "field",
                value: viTri,
                msg: "vitri phải thuộc định dạng Mongo Object ID",
                path: "vitri",
                location: "body"
              }], message:"vitri phải thuộc định dạng Mongo Object ID"})
              return
            }
          }

          let perPage = 3;
          let page = req.query.page || 1; 
          let result = await model.getBaiTest(term,viTri,page, perPage)
          if(result.totalPages>0){
            return res.send({status:"true", data: result, message:"Tìm danh sách bài test thành công"})
          } else {
            res.status(404).json({status:"false", message:"Không tìm thấy danh sách bài test"})
            return
          }         
        } catch (error) {
          console.log(error);
          res.status(400).json({status:"false",data:{
            errorName: error.name,
            errorMsg : error.message
          }, message:"Lỗi khi tìm danh sách bài test"})
          return
        }
  }

  getDanhSachCauHoi = async (req,res) => {
    try {
      let idBaiTest = req.query.idbaitest
      if(!idBaiTest){
        res.status(400).json({status:"false",data:[{
          type: "query",
          value: idBaiTest,
          msg: "Thiếu id bài test",
          path: "idbaitest",
          location: "param"
        }], message:"Thiếu id bài test"})
        return
      }
      
      let result

      try {
        result = await baiTestDauVaoModel.danhSachCauHoi(idBaiTest)
      } catch (error) {
        throw error
      }

      return res.send({status:"true", data:result, message:"Lấy danh sách câu hỏi thành công"})
    } catch (error) {
      console.log(error);
      res.status(400).json({status:"false",data:{
        errorName: error.name,
        errorMsg : error.message
      }, message:"Lỗi khi tìm danh sách câu hỏi"})
      return
    }
  }

  nopBaiTest = async (req,res) => {
    try {
      let idBaiTest
      let dsDapAnUngVien = req.body.dsDapAnUngVien
      let idYeuCauUngTuyen = req.body.idYeuCauUngTuyen
      let idUngVien 
      let dsDapAn
      let dapAnBaiTest
      let score = 0

      // const findArrayById = async (arr, id) =>{
      //   let result = await arr.find(e => e._id == new mongoose.Types.ObjectId(id))
      //   return result
      // }

      if (!idYeuCauUngTuyen) {
        return res.send({status:"false", message:"Thiếu id yêu cầu ứng tuyển"})
      }

      try {
        let yeuCauUngTuyen = await yeuCauUngTuyenModel.getById(new mongoose.Types.ObjectId(idYeuCauUngTuyen))
        idBaiTest = yeuCauUngTuyen.id_bai_test
        idUngVien = yeuCauUngTuyen.id_ung_vien

        if (!idBaiTest) {
          return res.send({status:"false", message:"Thiếu id bài test"})
        }
      } catch (error) {
        throw error
      }

      try {
        dapAnBaiTest = await baiTestDauVaoModel.danhSachDapAn(idBaiTest)
        dsDapAn = dapAnBaiTest[0].cau_hoi
      } catch (error) {
        throw error
      }
      
      const asyncCheckDapAn = async(e, dsDapAn, score)=>{
        let dapAn = await dsDapAn.find(i => i._id.toString() == e.idCauHoi.toString())
        console.log(dapAn.dap_an_dung.toString() == e.dapAnUngVien.toString());
        if(dapAn.dap_an_dung.toString() == e.dapAnUngVien.toString()){
          console.log(Number(dapAn.so_diem_cau_hoi));
          score += Number(dapAn.so_diem_cau_hoi)
        }
        console.log(score);
        return score
      }

      await dsDapAnUngVien.map(e => {
        asyncCheckDapAn(e, dsDapAn, score)
        console.log("hello");
      })

      if(score >= dapAnBaiTest.so_diem_toi_thieu){
        let updatedData = {
          diem_lam_test_dau_vao:score,
          trang_thai:"Đang ứng tuyển"
        }

        let result = {
          ketQua:'Pass',
          score:score
        }

        try {
          await yeuCauUngTuyenModel.update(idYeuCauUngTuyen, updatedData)
          res.send({status:"true", data:result, message:"Nộp bài test thành công"})
        } catch (error) {
          throw error
        }
      } else {
        let updatedDataYeuCauUngTuyen = {
          diem_lam_test_dau_vao:score,
          trang_thai:"Đã lưu lại hồ sơ"
        }

        let updatedDataUngVien = {
          trang_thai:"Đã lưu lại hồ sơ"
        }

        let result = {
          ketQua:'Fail',
          score:score
        }

        try {
          await yeuCauUngTuyenModel.update(idYeuCauUngTuyen, updatedDataYeuCauUngTuyen)
          await ungVienModel.update(idUngVien, updatedDataUngVien)
          res.send({status:"true", data:result, message:"Nộp bài test thành công"})
        } catch (error) {
          throw error
        }
      }
    } catch (error) {
      console.log(error);
      return res.send({status:"false", message:"Lỗi khi nộp bài test"})
    }
  }
}
module.exports = new BaiTestDauVaoController();