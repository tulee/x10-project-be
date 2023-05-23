const { default: mongoose } = require("mongoose");
const dotTuyenDungModel = require('../models/dotTuyenDung.model');
const dotTuyenDung_ViTriModel = require('../models/dotTuyenDung_ViTri.model');
const { validationResult } = require("express-validator");
const viTriModel = require("../models/viTri.model");

class DotTuyenDungController {
  constructor() { }

  getDotTuyenDung = async (req, res) => {
    let term = req.query.term
    let perPage = 1000;
    let page = req.query.page || 1;
    let result = await dotTuyenDungModel.getDotTuyenDung(term, page, perPage)
    if (result.totalPages > 0) {
      res.send({ status: "true", data: result, message: "Tìm đợt tuyển dụng thành công" })
    } else {
      res.send({ status: "false", message: "Không tìm thấy đợt tuyển dụng" })
    }
  }

  getDotTuyenDungDetail = async (req, res) => {
    try {
      let idDotTuyenDung = req.params.iddottuyendung

      if (!idDotTuyenDung) {
        res.status(400).json({ status: "false", message: "Thiếu id đợt tuyển dụng" })
        return
      }

      try {
        let result = await dotTuyenDungModel.getDotTuyenDungDetail(idDotTuyenDung)

        return res.send({ status: "true", data: result, message: "Tìm chi tiết đợt tuyển dụng thành công" })

      } catch (error) {
        throw error
      }
    } catch (error) {
      console.log(error);
      res.status(400).json({
        status: "false", data: {
          errorName: error.name,
          errorMsg: error.message
        }, message: "Lỗi khi tìm chi tiết đợt tuyển dụng"
      })
      return
    }
  }

  getDanhSachUngVienDotTuyenDung = async (req, res) => {
    try {
      let term = req.query.term
      let idViTri = req.query.vitri
      let perPage = req.query.perpage || 15;
      let idDotTuyenDung = req.query.iddottuyendung
      let page = req.query.page || 1;

      if (!idDotTuyenDung) {
        res.status(400).json({ status: "false", message: "Thiếu id đợt tuyển dụng" })
        return
      }

      try {
        let result = await dotTuyenDungModel.getDanhSachUngVien(idDotTuyenDung, term, idViTri, page, perPage)

        if (result.totalPages > 0) {
          return res.send({ status: "true", data: result, message: "Tìm danh sách ứng viên thành công" })
        } else {
          res.status(400).json({ status: "false", message: "Không tìm thấy danh sách ứng viên" })
          return
        }

      } catch (error) {
        throw error
      }
    } catch (error) {
      console.log(error);
      res.status(400).json({
        status: "false", data: {
          errorName: error.name,
          errorMsg: error.message
        }, message: "Lỗi khi tìm danh sách ứng viên"
      })
      return
    }
  }

  createDotTuyenDung = async (req, res) => {
    try {
      let data = req.body

      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        res.status(400).json({ status: "false", data: errors.array(), message: "Lỗi khi tạo đợt tuyển dụng" });
        return
      } else {
        let ngay_ket_thuc_gan_nhat = await dotTuyenDungModel.getLastedDotTuyenDung()
        if (new Date(data.ngay_bat_dau) <= new Date(ngay_ket_thuc_gan_nhat)) {
          res.status(400).json({ status: "false", message: `Đợt tuyển dụng trước chưa kết thúc, ngày kết thúc gần nhất là: ${ngay_ket_thuc_gan_nhat}` })
          return
        } else {
          let newDotTuyenDung = {
            ten: data.ten,
            ngay_bat_dau: data.ngay_bat_dau,
            ngay_ket_thuc: data.ngay_ket_thuc,
            ngay_chỉnh_sua_gan_nhat: new Date(),
            mo_ta_khac: data.mo_ta_khac
          }

          let resultDotTuyenDung = await dotTuyenDungModel.create(newDotTuyenDung)

          if (!resultDotTuyenDung._id) {
            res.status(408).json({ status: "false", message: "Lỗi khi tạo đợt tuyển dụng, xin vui lòng thử lại" })
            return
          } else {
            const createAsyncDotTuyenDung_ViTri = async (info) => {
              let result = await dotTuyenDung_ViTriModel.create(info)
              return result
            }

            if (data.vi_tri) {
              data.vi_tri.map(viTri => {
                let newDotTuyenDung_ViTri = {
                  id_dot_tuyen_dung: resultDotTuyenDung._id,
                  id_vi_tri: new mongoose.Types.ObjectId(viTri.id_vi_tri),
                  so_luong: viTri.so_luong
                }

                createAsyncDotTuyenDung_ViTri(newDotTuyenDung_ViTri)
              })
            }

            res.send({ status: "true", data: resultDotTuyenDung, message: "Tạo đợt tuyển dụng thành công" })
          }
        }
      }

    } catch (error) {
      console.log(error);
      res.status(400).json({
        status: "false", data: {
          errorName: error.name,
          errorMsg: error.message
        }, message: "Lỗi khi tạo đợt tuyển dụng"
      })
      return
    }
  }

  updateDotTuyenDung = async (req, res) => {
    try {
      let data = req.body

      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        res.status(400).json({ status: "false", data: errors.array(), message: "Lỗi khi cập nhật đợt tuyển dụng" });
        return
      } else {
        let ngay_ket_thuc_gan_nhat = await dotTuyenDungModel.getLastedDotTuyenDung()

        if (new Date(data.ngay_bat_dau) <= new Date(ngay_ket_thuc_gan_nhat)) {
          res.status(400).json({ status: "false", message: `Đợt tuyển dụng trước chưa kết thúc, ngày kết thúc gần nhất là: ${ngay_ket_thuc_gan_nhat}` })
          return
        } else {

          let updatedData = {
            ten: data.ten,
            ngay_bat_dau: data.ngay_bat_dau,
            ngay_ket_thuc: data.ngay_ket_thuc,
            ngay_chỉnh_sua_gan_nhat: new Date(),
            mo_ta_khac: data.mo_ta_khac
          }

          let danhSachViTri = data.vi_tri.map(e => ({
            _id: e.id_dot_tuyen_dung_vi_tri,
            id_dot_tuyen_dung: e.id_dot_tuyen_dung,
            so_luong: e.so_luong,
            id_vi_tri: e.id_vi_tri
          }))

          let existingViTri = await dotTuyenDung_ViTriModel.getAllByInfo({ id_dot_tuyen_dung: data.idDotTuyenDung })

          console.log(existingViTri);

          async function asyncDeleteDotTuyenDung_ViTri(data) {
            let promises = data.map(async (e) => {
              return await dotTuyenDung_ViTriModel.delete(e._id)
            })

            return await Promise.all(promises)
          }

          async function asyncCreateDotTuyenDung_ViTri(data) {
            let promises = data.map(async (e) => {
              return await dotTuyenDung_ViTriModel.create(e)
            })

            return await Promise.all(promises)
          }

          try {
            await asyncDeleteDotTuyenDung_ViTri(existingViTri)
            await asyncCreateDotTuyenDung_ViTri(danhSachViTri)
          } catch (error) {
            throw error
          }

          res.send({ status: "true", message: "Cập nhật đợt tuyển dụng thành công" })
        }
      }

    } catch (error) {
      console.log(error);
      res.status(400).json({
        status: "false", data: {
          errorName: error.name,
          errorMsg: error.message
        }, message: "Lỗi khi cập nhật đợt tuyển dụng"
      })
      return
    }
  }

  deleteDotTuyenDung = async (req, res) => {
    try {
      let idList = req.body.idList
      // if(!ObjectId.isValid(id)){
      //   res.status(400).json({status:"false",data:[{
      //     type: "field",
      //     value: id,
      //     msg: "Id phải ở định dạng Mongo Object Id",
      //     path: "id",
      //     location: "body"
      //   }], message:"Id phải ở định dạng Mongo Object Id"})
      //   return
      // }

      const asyncDeleteDotTuyenDung = async (id) => {
        let res = await dotTuyenDungModel.delete(new mongoose.Types.ObjectId(id))
        return res
      }

      try {
        idList.map(e => asyncDeleteDotTuyenDung(e))
      } catch (error) {
        throw error
      }
      res.status(200).json({ status: "true", message: "Xóa vị trí thành công" })
      return
    } catch (error) {
      console.log(error);
      res.status(400).json({
        status: "false", data: {
          errorName: error.name,
          errorMsg: error.message
        }, message: "Lỗi khi xóa đợt tuyển dụng"
      })
      return
    }
  }
}

module.exports = new DotTuyenDungController();