const ungVienModel = require('../models/ungVien.model');
const dotTuyenDungModel = require('../models/dotTuyenDung.model');
const yeuCauUngTuyenModel = require('../models/yeuCauUngTuyen.model');
const dotTuyenDung_ViTriModel = require('../models/dotTuyenDung_ViTri.model');
const { default: mongoose, model } = require("mongoose");
const { validationResult } = require('express-validator');
const cloudinary = require('cloudinary').v2;

class UngVienController {
  constructor() {}

  danhSachUngVien = async (req, res, next) => {
    try {
      let term = req.query.term
      let perPage = req.query.perpage||1000;
      let page = req.query.page || 1; 
      let result = await ungVienModel.getDanhSachUngVien(term,page, perPage)
      if(result.totalPages>0){
        res.send({status:"true", data: result, message:"Tìm ứng viên thành công"})
      } else {
        res.status(404).json({status:"false", message:"Không tìm thấy ứng viên"})
        return
      }
    } catch (error) {
      console.log(error); 
      res.status(400).json({status:"false",data:{
        errorName: error.name,
        errorMsg : error.message
      }, message:"Lỗi khi load danh sách ứng viên, vui lòng thử lại"})

      return
    }
  }

  ungTuyen = async (req, res, next) => {
    try {
      if(!req.file){
        res.status(400).json({ status:"false", message:"Lỗi khi upload CV, vui lòng thử lại, hãy đảm bảo bạn đã upload CV!" });
        return
      }

      let filename = req.file.filename      

      const errors = validationResult(req);
        if(!errors.isEmpty()){
          res.status(400).json({ status:"false", data: errors.array(), message:"Lỗi khi ứng tuyển" });
          cloudinary.uploader.destroy(filename)
          return
        }

      const thongTinUngTuyen = req.body  
      console.log(req.file.filename);
      // let filename = req.file.filename  
      // if(!thongTinUngTuyen.ho_va_ten || !thongTinUngTuyen.email || !thongTinUngTuyen.id_dot_tuyen_dung || !thongTinUngTuyen.id_vi_tri || !req.file){
      //   if(filename){
      //     cloudinary.uploader.destroy(filename).then(
      //       res.send({status:"false", message:"Thiếu thông tin ứng tuyển"})
      //     );
      //   }else {
      //     res.send({status:"false", message:"Thiếu thông tin ứng tuyển"})
      //   }
        
      // } else {
      let thongTinUngVien = {
        ho_va_ten: thongTinUngTuyen.ho_va_ten,
        gioi_tinh:thongTinUngTuyen.gioi_tinh,
        nam_sinh:thongTinUngTuyen.nam_sinh,
        email:thongTinUngTuyen.email,
        sdt:thongTinUngTuyen.sdt,
        trang_thai:"Đang ứng tuyển",
        cv:req.file.path
      }

      let dot_tuyen_dung_vi_tri = await dotTuyenDung_ViTriModel.getOneByInfo({
        id_dot_tuyen_dung: new mongoose.Types.ObjectId(thongTinUngTuyen.id_dot_tuyen_dung),
        id_vi_tri:new mongoose.Types.ObjectId(thongTinUngTuyen.id_vi_tri)
      })

      if(!dot_tuyen_dung_vi_tri){
        res.status(400).json({ status:"false", message:"Đợt tuyển dụng không có vị trí này" });
        cloudinary.uploader.destroy(filename)
        return
      }

      let id_dot_tuyen_dung_vi_tri = dot_tuyen_dung_vi_tri._id

      // try {
      //   id_dot_tuyen_dung_vi_tri = dot_tuyen_dung_vi_tri._id
      // } catch (err){
      //   throw err
      // }

      // if(!id_dot_tuyen_dung_vi_tri){
      //   res.status(400).json({ status:"false", message:"Đợt tuyển dụng không có vị trí này" });
      //   cloudinary.uploader.destroy(filename)
      //   return
      //   // cloudinary.uploader.destroy(filename).then(
      //   //   res.send({status:"false", message:"Đợt tuyển dụng không có vị trí này"})
      //   // );
      // } else {
        let dotTuyenDung = await dotTuyenDungModel.getById(thongTinUngTuyen.id_dot_tuyen_dung)

        if(!dotTuyenDung){
          res.status(400).json({ status:"false", message:"Không tìm thấy đợt tuyển dụng với Id đã cho" });
          cloudinary.uploader.destroy(filename)
          return
        }

        if(dotTuyenDung.ngay_ket_thuc < new Date()){
          res.status(400).json({ status:"false", message:"Đợt tuyển dụng đã kết thúc" });
          cloudinary.uploader.destroy(filename)
          return
          // cloudinary.uploader.destroy(filename).then(
          //   res.send({status:"false", message:"Đợt tuyển dụng đã kết thúc"})
          // );
        } else {
          let thongTinYeuCauUngTuyen = {
            id_dot_tuyen_dung_vi_tri:id_dot_tuyen_dung_vi_tri,
            id_bai_test:null,
            // id_ung_vien:,
            diem_lam_test_dau_vao:null,
            trang_thai:"Đang ứng tuyển",
            hinh_thuc_pv:null,
            thoi_gian_pv:null,
            nguoi_pv:null,
            ket_qua_pv:null,
            ngay_nhan_viec:null,
          }
    
          let checkExistingUngVien = await ungVienModel.getOneByInfo({
            ho_va_ten:thongTinUngTuyen.ho_va_ten,
            email:thongTinUngTuyen.email
          })
    
          // res.send(checkExistingUngVien)
    
          if(checkExistingUngVien){
              await ungVienModel.update(checkExistingUngVien._id,thongTinUngVien)
      
              let checkExistingYeuCauUngTuyen = await yeuCauUngTuyenModel.getOneByInfo({
                id_dot_tuyen_dung_vi_tri:id_dot_tuyen_dung_vi_tri,
                id_ung_vien:checkExistingUngVien._id
              })
        
              thongTinYeuCauUngTuyen.id_ung_vien = checkExistingUngVien._id
              
              let result = {
                ungVien:checkExistingUngVien
              }
  
              if(checkExistingYeuCauUngTuyen){
                await yeuCauUngTuyenModel.update(checkExistingYeuCauUngTuyen._id, thongTinYeuCauUngTuyen)
                let newYeuCauUngTuyen = await yeuCauUngTuyenModel.getById(checkExistingYeuCauUngTuyen._id)
                result.yeuCauUngTuyen = newYeuCauUngTuyen
                res.send({status:"true", messgae:"Ứng tuyển thành công", data: result})
              } else {
                let newYeuCauUngTuyen = await yeuCauUngTuyenModel.create(thongTinYeuCauUngTuyen)
                result.yeuCauUngTuyen = newYeuCauUngTuyen
                res.send({status:"true", messgae:"Ứng tuyển thành công", data: result})
              }
            } else {
              let newUngVien = await ungVienModel.create(thongTinUngVien)
              thongTinYeuCauUngTuyen.id_ung_vien = newUngVien._id
              let newYeuCauUngTuyen = await yeuCauUngTuyenModel.create(thongTinYeuCauUngTuyen)
              result = {
                ungVien:newUngVien,
                yeuCauUngTuyen:newYeuCauUngTuyen
              }
              res.send({status:"true", messgae:"Ứng tuyển thành công", data: result})
            }
        // } 
      // }
    }
    } catch (error) {
      console.log(error);
      // let filename = req.file.filename  
      // if(filename){
      //   cloudinary.uploader.destroy(filename)   
      // }   
      res.status(400).json({status:"false",data:{
        errorName: error.name,
        errorMsg : error.message
      }, message:"Lỗi khi ứng tuyển, vui lòng thử lại"})

      return
    }
  }
  }

module.exports = new UngVienController();