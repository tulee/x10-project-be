const baiTestDauVaoModel = require('../models/baiTestDauVao.model');
const cauHoiModel = require('../models/cauHoi.model')
const ungVienModel = require('../models/ungVien.model');
const yeuCauUngTuyenModel = require('../models/yeuCauUngTuyen.model');
// const model = require('../models/baiTestDauVao.model');
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

        let infoBaiTest = {
          ma_bai_test:data.ma_bai_test,
          mo_ta:data.mo_ta,
          ngay_tao_bai_test: new Date(),
          ngay_chinh_sua_gan_nhat: new Date(),
          so_diem_toi_thieu:data.so_diem_toi_thieu,    
          ten_bai_test:data.ten_bai_test,
          thoi_luong:data.thoi_luong,
          vi_tri:data.vi_tri
        }

        let newBaiTest 
        
        try {
          newBaiTest = await baiTestDauVaoModel.create(infoBaiTest)
        } catch (error) {
          throw error
        }

        let idBaiTest = newBaiTest._id

        let danhSachCauHoi = data.danhSachCauHoi

        const createAsyncCauHoi = async (info) => {
          let result = await cauHoiModel.create(info)
          return result
        }

        let newDanhSachCauHoi = []

        try {
          danhSachCauHoi.map(e => {
            e.id_bai_test=idBaiTest
            let res = createAsyncCauHoi(e)
            newDanhSachCauHoi.push(res)
          })
        } catch (error) {
          throw error
        }

        let resultTaoBaiTest = {
          newBaiTest,
          newDanhSachCauHoi
        }

        res.status(200).json({status:"true", data:resultTaoBaiTest, message:"Tạo bài test thành công"})
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

        let danhSachCauHoi = await cauHoiModel.getAllByInfo({id_bai_test:new mongoose.Types.ObjectId(id)})

        const asyncDeleteCauHoiById = async (id) => {
          let res = await cauHoiModel.delete(id)
          return res
        }

        try {
          danhSachCauHoi.map(e => asyncDeleteCauHoiById(e._id))

          let resultDeleteBaiTest = await baiTestDauVaoModel.delete(id)

          res.status(200).json({status:"true", data:resultDeleteBaiTest, message:"Xóa bài test thành công"})
          return
        } catch (error) {
          throw error
        }
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

        let data = req.body

        // if(!ObjectId.isValid(data.id_bai_test)){
        //   res.status(400).json({status:"false",data:[{
        //     type: "field",
        //     value: id_bai_test,
        //     msg: "Id bài test phải ở định dạng Mongo Object Id",
        //     path: "id_bai_test",
        //     location: "body"
        //   }], message:"Id bài test phải ở định dạng Mongo Object Id"})
        //   return
        // }

        data.ngay_chinh_sua_gan_nhat = new Date()

        let newInfoBaiTest = {
          ma_bai_test:data.ma_bai_test,
          ten_bai_test:data.ten_bai_test,
          thoi_luong:data.thoi_luong,
          mo_ta:data.mo_ta,
          ngay_tao_bai_test:data.ngay_tao_bai_test,
          so_diem_toi_thieu:data.so_diem_toi_thieu,
          vi_tri:data.vi_tri
        }

        let resultUpdateInfoBaiTest = await baiTestDauVaoModel.update(data.id_bai_test, newInfoBaiTest)

        let danhSachCauHoi = data.cau_hoi
        let existingCauHoi

        try {
          existingCauHoi = await cauHoiModel.getAllByInfo({id_bai_test:data.id_bai_test})
        } catch (error) {
          throw error
        }

        async function asyncDeleteCauHoi(data) {
          let promises = data.map(async (e) => {
            return await cauHoiModel.delete(e._id)
          })
          return await Promise.all(promises)
        }
        async function asyncCreateCauHoi(data) {
          let promises = data.map(async (e) => {
            return await cauHoiModel.create(e)
          })
          return await Promise.all(promises)
        }

        try {
          await asyncDeleteCauHoi(existingCauHoi)
          await asyncCreateCauHoi(danhSachCauHoi)
        } catch (error) {
          throw error
        }

        res.status(200).json({status:"true", message:"Cập nhật bài test thành công"})
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

    updateThongTinBaiTest = async(req,res) => {
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

        data.ngay_chinh_sua_gan_nhat = new Date()

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

          let perPage = 1000;
          let page = req.query.page || 1; 
          let result = await baiTestDauVaoModel.getBaiTest(term,viTri,page, perPage)
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

  getChiTietBaiTest = async (req,res) => {
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

      if(!ObjectId.isValid(idBaiTest)){
        res.status(400).json({status:"false",data:[{
          type: "field",
          value: idBaiTest,
          msg: "Id bài test phải thuộc định dạng Mongo Object ID, có 24 kí tự",
          path: "idbaitest",
          location: "query"
        }], message:"Id bài test phải thuộc định dạng Mongo Object ID, có 24 kí tự"})
        return
      }
      
      let result

      try {
        result = await baiTestDauVaoModel.chiTietBaiTest(idBaiTest)
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
      const errors = validationResult(req);
      if(!errors.isEmpty()){
        res.status(400).json({ status:"false", data: errors.array(), message:"Lỗi khi cập nhật bài test" });
        return
      }

      let idBaiTest
      let dsDapAnUngVien = req.body.dsDapAnUngVien
      let idYeuCauUngTuyen = req.body.idYeuCauUngTuyen
      let idUngVien 
      let dsDapAn
      let dapAnBaiTest
      let score = 0

      if(!ObjectId.isValid(idYeuCauUngTuyen)){
        res.status(400).json({status:"false", message:"Id yêu cầu ứng tuyển phải ở định dạng Mongo ObjectId"})
        return
      }

      try {
        let yeuCauUngTuyen = await yeuCauUngTuyenModel.getById(new mongoose.Types.ObjectId(idYeuCauUngTuyen))

        if(!yeuCauUngTuyen){
          res.status(400).json({status:"false", message:`Không tim thấy yêu cầu ứng tuyển với Id ${idYeuCauUngTuyen}`})
          return
        }

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
      
      const asyncCheckDapAn = (e, dsDapAn)=>{
        let dapAn = dsDapAn.find(i => i._id.toString() == e.idCauHoi.toString())

        if(!dapAn){
          let err = {
            name:"Data Error",
            message:`Không tìm thấy câu hỏi với id ${e.idCauHoi.toString()}`
          }
           throw err
        }

        if(dapAn.dap_an_dung.toString() == e.dapAnUngVien.toString()){
          score = Number(score) + Number(dapAn.so_diem_cau_hoi)
        }
        return score
      }

      await dsDapAnUngVien.map(e => {
        asyncCheckDapAn(e, dsDapAn)
      })

      if(score >= dapAnBaiTest[0].so_diem_toi_thieu){
        let updatedData = {
          diem_lam_test_dau_vao:score,
          trang_thai:"Đang ứng tuyển"
        }

        let updatedDataUngVien = {
          trang_thai:"Đang ứng tuyển"
        }

        let result = {
          ketQua:'Pass',
          score:score
        }

        try {
          await yeuCauUngTuyenModel.update(idYeuCauUngTuyen, updatedData)
          await ungVienModel.update(idUngVien, updatedDataUngVien)
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
      res.status(400).json({status:"false",data:{
        errorName: error.name,
        errorMsg : error.message
      }, message:"Lỗi khi tìm danh sách câu hỏi"})
      return
    }
  }
}
module.exports = new BaiTestDauVaoController();