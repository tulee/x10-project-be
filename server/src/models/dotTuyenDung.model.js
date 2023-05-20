const mongoose = require('mongoose');
const BaseModel = require('./base.model');
const DotTuyenDungSchema = require('./schemas/dotTuyenDung.schema');
class DotTuyenDungModel extends BaseModel {
    constructor(){
        super()
        this.init("dot-tuyen-dung", DotTuyenDungSchema, "dot-tuyen-dung");
    }

    async getLastedDotTuyenDung (){
      const aggSort = [
        {
          '$sort': {
            'ngay_ket_thuc': -1
          }
        }
      ]

      let sortedList = await this.model.aggregate(aggSort).exec()

      return sortedList[0].ngay_ket_thuc
    }

    async getDotTuyenDung(term, page, perPage){
        const agg = [{
            '$match': {
              'ten': {
                '$regex': '', 
                '$options': 'i'
              }
            }
          }]
        const aggTerm = 
            {
              '$match': {
                'ten': {
                  '$regex': term, 
                  '$options': 'i'
                }
              }
            }
        
        if(term && term != ""){
            agg.push(aggTerm)
        }

        let danhsach = await this.model
                                .aggregate(agg)
                                .exec()
        let totalPages = Math.ceil(danhsach.length/perPage)
        let start = (perPage * page) - perPage
        let end = start + perPage    
        danhsach = danhsach.slice(start, end)
        return {currentPage: page, totalPages: totalPages, danhsach:danhsach}
    }

    async getDotTuyenDungDetail(idDotTuyenDung) {
        const agg = [
          {
            '$match': {
              '_id': new mongoose.Types.ObjectId(idDotTuyenDung)
            }
          }, {
            '$lookup': {
              'from': 'dot-tuyen-dung_vi-tri', 
              'localField': '_id', 
              'foreignField': 'id_dot_tuyen_dung', 
              'as': 'vi_tri'
            }
          }, {
            '$unwind': {
              'path': '$vi_tri'
            }
          }, {
            '$lookup': {
              'from': 'vi-tri', 
              'localField': 'vi_tri.id_vi_tri', 
              'foreignField': '_id', 
              'as': 'vi_tri.chi_tiet_vi_tri'
            }
          }, {
            '$unwind': {
              'path': '$vi_tri.chi_tiet_vi_tri'
            }
          }, {
            '$group': {
              '_id': '$_id', 
              'ten': {
                '$first': '$ten'
              }, 
              'ngay_bat_dau': {
                '$first': '$ngay_bat_dau'
              }, 
              'ngay_ket_thuc': {
                '$first': '$ngay_ket_thuc'
              }, 
              'ngay_chinh_sua_gan_nhat': {
                '$first': '$ngay_chinh_sua_gan_nhat'
              }, 
              'mo_ta_khac': {
                '$first': "$mo_ta_khac",
              },
              'vi_tri': {
                '$push': {
                  'id_dot_tuyen_dung_vi_tri': '$vi_tri._id', 
                  'so_luong': '$vi_tri.so_luong', 
                  'ten_vi_tri': '$vi_tri.chi_tiet_vi_tri.ten_vi_tri', 
                  'ma_vi_tri': '$vi_tri.chi_tiet_vi_tri.ma_vi_tri', 
                  'mo_ta': '$vi_tri.chi_tiet_vi_tri.mo_ta'
                }
              }
            }
          }
        ]

        let danhsach = await this.model.aggregate(agg).exec()

        return ({danhsach:danhsach})
    }

    async getDanhSachUngVien(idDotTuyenDung, term, idViTri, page, perPage){
        const agg = [
          {
            '$match': {
              '_id': new mongoose.Types.ObjectId(idDotTuyenDung)
            }
          }, {
            '$lookup': {
              'from': 'dot-tuyen-dung_vi-tri', 
              'localField': '_id', 
              'foreignField': 'id_dot_tuyen_dung', 
              'as': 'dot_tuyen_dung_vi_tri'
            }
          }, {
            '$unwind': {
              'path': '$dot_tuyen_dung_vi_tri'
            }
          }, {
            '$lookup': {
              'from': 'yeu-cau-ung-tuyen', 
              'localField': 'dot_tuyen_dung_vi_tri._id', 
              'foreignField': 'id_dot_tuyen_dung_vi_tri', 
              'as': 'yeu_cau_ung_tuyen'
            }
          }, {
            '$unwind': {
              'path': '$yeu_cau_ung_tuyen'
            }
          }, {
            '$lookup': {
              'from': 'ung-vien', 
              'localField': 'yeu_cau_ung_tuyen.id_ung_vien', 
              'foreignField': '_id', 
              'as': 'ung_vien'
            }
          }, {
            '$unwind': {
              'path': '$ung_vien'
            }
          }, {
            '$lookup': {
              'from': 'vi-tri', 
              'localField': 'dot_tuyen_dung_vi_tri.id_vi_tri', 
              'foreignField': '_id', 
              'as': 'ten_vi_tri'
            }
          }, {
            '$unwind': {
              'path': '$ten_vi_tri'
            }
          }, {
            '$group': {
              '_id': '$_id', 
              'ung_vien': {
                '$push': {
                  'id_ung_vien': '$ung_vien._id', 
                  'ho_va_ten': '$ung_vien.ho_va_ten', 
                  'gioi_tinh': '$ung_vien.gioi_tinh', 
                  'nam_sinh': '$ung_vien.nam_sinh', 
                  'email': '$ung_vien.email', 
                  'sdt': '$ung_vien.sdt', 
                  'trang_thai': '$ung_vien.trang_thai', 
                  'id_vi_tri': '$ten_vi_tri._id', 
                  'ten_vi_tri': '$ten_vi_tri.ten_vi_tri', 
                  'id_bai_test': '$yeu_cau_ung_tuyen.id_bai_test', 
                  'diem_lam_test_dau_vao': '$yeu_cau_ung_tuyen.diem_lam_test_dau_vao', 
                  'hinh_thuc_pv': '$yeu_cau_ung_tuyen.hinh_thuc_pv', 
                  'thoi_gian_pv': '$yeu_cau_ung_tuyen.thoi_gian_pv', 
                  'nguoi_pv': '$yeu_cau_ung_tuyen.nguoi_pv', 
                  'ket_qua_pv': '$yeu_cau_ung_tuyen.ket_qua_pv', 
                  'ngay_nhan_viec': '$yeu_cau_ung_tuyen.ngay_nhan_viec',
                  'cv':'$ung_vien.cv'
                }
              }
            }
          }, {
            '$unwind': {
              'path': '$ung_vien'
            }
          }  
        ]
        
  
        if(idViTri && idViTri != ""){
          const aggViTri = 
          {
            '$match': {
              'ung_vien.id_vi_tri': new mongoose.Types.ObjectId(idViTri)
            }
          }  
          agg.push(aggViTri)
        }
  
        if(term && term != ""){
          const aggTerm = 
          {
            '$match': {
              '$or': [
                {
                  'ung_vien.ho_va_ten': {
                    '$regex': term, 
                    '$options': 'i'
                  }
                }, {
                  'ung_vien.email': {
                    '$regex': term, 
                    '$options': 'i'
                  }
                }, {
                  'ung_vien.sdt': {
                    '$regex': term, 
                    '$options': 'i'
                  }
                }
              ]
            }
          }
          
          agg.push(aggTerm)
        }

          let danhsach = await this.model.aggregate(agg).exec()
          let totalPages = Math.ceil(danhsach.length/perPage)
          let start = (perPage * page) - perPage
          let end = start + perPage    
          danhsach = danhsach.slice(start, end)
          return {currentPage: page, totalPages: totalPages, danhsach:danhsach}
    }
}

module.exports = new DotTuyenDungModel();
