const ungVienModel = require('../models/ungVien.model');
const dotTuyenDungModel = require('../models/dotTuyenDung.model');
const yeuCauUngTuyenModel = require('../models/yeuCauUngTuyen.model');
const dotTuyenDung_ViTriModel = require('../models/dotTuyenDung_ViTri.model');
const { default: mongoose, model } = require("mongoose");
const cloudinary = require('cloudinary').v2;

class YeuCauUngTuyenController {
  constructor() {}

  updateLichPv = async (req, res, next) => {
    try {
      let thoi_gian_pv = req.body.thoi_gian_pv
      let hinh_thuc_pv = req.body.hinh_thuc_pv
      let id_yeu_cau_ung_tuyen = new mongoose.Types.ObjectId(req.body.id_yeu_cau_ung_tuyen)

      if(!id_yeu_cau_ung_tuyen){
        return res.send({status:"false", message:"Thiếu thông tin để cập nhật"})
      }

      let updatedData = {}

      if(thoi_gian_pv){
        if(new Date(thoi_gian_pv) <= new Date()){
          return res.send({status:"false", message:"Ngày phỏng vấn phải sau ngày hôm nay"})
        } else {
          updatedData.thoi_gian_pv = thoi_gian_pv
        }
      }

      if(hinh_thuc_pv){
        updatedData.hinh_thuc_pv = hinh_thuc_pv
      }

      try {
        await yeuCauUngTuyenModel.update(id_yeu_cau_ung_tuyen, updatedData)
      } catch (error) {
        throw error
      }

      return res.send({status:"true", message:"Cập nhật lịch phỏng vấn thành công"})

    } catch (error) {
      console.log(error);
      return res.send({status:"false", message:"Lỗi khi cập nhật yêu cầu ứng tuyển"})
    }
  }

  updateKetQuaPv = async (req, res, next) =>{
    try {
      let ket_qua_pv = req.body.ket_qua_pv
      let id_yeu_cau_ung_tuyen = new mongoose.Types.ObjectId(req.body.id_yeu_cau_ung_tuyen)

      if (!ket_qua_pv || !id_yeu_cau_ung_tuyen){
        return res.send({status:"false", message:"Thiếu thông tin để cập nhật"})
      }

      if(ket_qua_pv=="Đậu"){
        try {
          await yeuCauUngTuyenModel.update(id_yeu_cau_ung_tuyen, {ket_qua_pv:ket_qua_pv})
        } catch (error) {
          throw error
        }
      } else {
        try {
          await yeuCauUngTuyenModel.update(id_yeu_cau_ung_tuyen, {ket_qua_pv:ket_qua_pv, trang_thai:"Đã lưu lại hồ sơ"})

          let yeu_cau_ung_tuyen = await yeuCauUngTuyenModel.getById(id_yeu_cau_ung_tuyen)
          let id_ung_vien = yeu_cau_ung_tuyen.id_ung_vien
          
          await ungVienModel.update(id_ung_vien, {trang_thai:"Đã lưu lại hồ sơ"})
        } catch (error) {
          throw error
        }
      }

      return res.send({status:"true", message:"Cập nhật kết quả phỏng vấn thành công"})
    } catch (error) {
      console.log(error);
      console.log(error);
      return res.send({status:"false", message:"Lỗi khi cập nhật kết quả phỏng vấn"})
    }
  }
}

module.exports = new YeuCauUngTuyenController();