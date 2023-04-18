const ungVienModel = require('../models/ungVien.model');
const dotTuyenDungModel = require('../models/dotTuyenDung.model');
const yeuCauUngTuyenModel = require('../models/yeuCauUngTuyen.model');
const dotTuyenDung_ViTriModel = require('../models/dotTuyenDung_ViTri.model');
const { default: mongoose, model } = require("mongoose");

class UngVienController {
  constructor() {}

  ungTuyen = async (req, res) => {
    const thongTinUngTuyen = req.body    
    if(!thongTinUngTuyen.ho_va_ten || !thongTinUngTuyen.email || !thongTinUngTuyen.id_dot_tuyen_dung || !thongTinUngTuyen.id_vi_tri){
      res.send({status:"false", message:"Thiếu thông tin ứng tuyển"})
    } else {
      let thongTinUngVien = {
        ho_va_ten: thongTinUngTuyen.ho_va_ten,
        gioi_tinh:thongTinUngTuyen.gioi_tinh,
        nam_sinh:thongTinUngTuyen.nam_sinh,
        email:thongTinUngTuyen.email,
        sdt:thongTinUngTuyen.sdt,
        trang_thai:"Đang ứng tuyển"
      }

      let dot_tuyen_dung_vi_tri = await dotTuyenDung_ViTriModel.getByInfo({
        id_dot_tuyen_dung: new mongoose.Types.ObjectId(thongTinUngTuyen.id_dot_tuyen_dung),
        id_vi_tri:new mongoose.Types.ObjectId(thongTinUngTuyen.id_vi_tri)
      })

      console.log(dot_tuyen_dung_vi_tri);

      let id_dot_tuyen_dung_vi_tri = dot_tuyen_dung_vi_tri._id

      if(!id_dot_tuyen_dung_vi_tri){
        res.send({status:"false", message:"Đợt tuyển dụng không có vị trí này"})
      } else {
        let dotTuyenDung = await dotTuyenDungModel.getById(thongTinUngTuyen.id_dot_tuyen_dung)

        if(dotTuyenDung.ngay_ket_thuc < new Date()){
          res.send({status:"false", message:"Đợt tuyển dụng đã kết thúc"})
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
            ngay_nhan_viec:null
          }
    
          let checkExistingUngVien = await ungVienModel.getByInfo({
            ho_va_ten:thongTinUngTuyen.ho_va_ten,
            email:thongTinUngTuyen.email
          })
    
          // res.send(checkExistingUngVien)
    
          if(checkExistingUngVien){
              await ungVienModel.update(checkExistingUngVien._id,thongTinUngVien)
      
              let checkExistingYeuCauUngTuyen = await yeuCauUngTuyenModel.getByInfo({
                id_dot_tuyen_dung_vi_tri:id_dot_tuyen_dung_vi_tri,
                id_ung_vien:checkExistingUngVien._id
              })
        
              thongTinYeuCauUngTuyen.id_ung_vien = checkExistingUngVien._id
              
              let result
  
              if(checkExistingYeuCauUngTuyen){
                await yeuCauUngTuyenModel.update(checkExistingYeuCauUngTuyen._id, thongTinYeuCauUngTuyen)
                result = await yeuCauUngTuyenModel.getById(checkExistingYeuCauUngTuyen._id)
                res.send({status:"true", messgae:"Ứng tuyển thành công", data: result})
              } else {
                result = await yeuCauUngTuyenModel.create(thongTinYeuCauUngTuyen)
                res.send({status:"true", messgae:"Ứng tuyển thành công", data: result})
              }
            } else {
              let result = await ungVienModel.create(thongTinUngVien)
              res.send({status:"true", messgae:"Ứng tuyển thành công", data: result})
            }
        } 
      }
    }
  }
  }

module.exports = new UngVienController();