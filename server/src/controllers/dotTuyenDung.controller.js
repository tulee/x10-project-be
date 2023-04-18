const { default: mongoose } = require("mongoose");
const dotTuyenDungModel = require('../models/dotTuyenDung.model');
const dotTuyenDung_ViTriModel = require('../models/dotTuyenDung_ViTri.model');

class DotTuyenDungController {
    constructor() {}

    getDotTuyenDung = async (req, res) => {
      let term = req.query.term
      let perPage = 3;
      let page = req.query.page || 1; 
      let result = await dotTuyenDungModel.getDotTuyenDung(term,page, perPage)
      if(result.totalPages>0){
        res.send({status:"true", data: result, message:"Tìm đợt tuyển dụng thành công"})
      } else {
        res.send({status:"false", message:"Không tìm thấy đợt tuyển dụng"})
      }
    }

    createDotTuyenDung = async (req,res) => {
      let data = req.body

      if(!data.ten || !data.ngay_bat_dau || !data.ngay_ket_thuc){
        res.send({status:"false", message:"Thiếu thông tin đợt tuyển dụng"})
      } else {
        let newDotTuyenDung = {
          ten:data.ten,
          ngay_bat_dau:data.ngay_bat_dau,
          ngay_ket_thuc:data.ngay_ket_thuc,
          ngay_chỉnh_sua_gan_nhat: new Date(),
          mo_ta_khac:data.mo_ta_khac
        }

        let resultDotTuyenDung = await dotTuyenDungModel.create(newDotTuyenDung)

        if(!resultDotTuyenDung._id){
          res.send({status:"false", message:"Lỗi tạo đợt tuyển dụng"})
        } else {
          const createAsyncDotTuyenDung_ViTri = async (info) => {
            let result = await dotTuyenDung_ViTriModel.create(info)
            return result
          }

          if(data.vi_tri){
            data.vi_tri.map(viTri => {
              let newDotTuyenDung_ViTri = {
                id_dot_tuyen_dung:resultDotTuyenDung._id,
                id_vi_tri: new mongoose.Types.ObjectId(viTri.id_vi_tri),
                so_luong:viTri.so_luong
              }

              createAsyncDotTuyenDung_ViTri(newDotTuyenDung_ViTri)
            })
          }

          res.send({status:"true", message:"Tạo đợt tuyển dụng thành công"})
        }
      }
    }

    
  }

module.exports = new DotTuyenDungController();