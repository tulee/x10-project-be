const mongoose = require('mongoose');
const BaseModel = require('./base.model');
const BaiTestDauVaoSchema = require('./schemas/baiTestDauVao.schema');
class BaiTestDauVaoModel extends BaseModel {
    constructor(){
        super()
        this.init("bai-test-dau-vao", BaiTestDauVaoSchema, "bai-test-dau-vao");
    }

    
    async getBaiTestByMaBaiTest(ma_bai_test){
      const query = this.model.findOne({ma_bai_test: ma_bai_test});
      return query.exec();
    }

    async getBaiTest(term, viTri,page, perPage){
        try {
          let agg = [
            {
              '$match': {
                'ten_bai_test': {
                  '$regex': '', 
                  '$options': 'i'
                }
              }
            }
          ]
          let aggTerm = 
              {
                '$match': {
                  'ten_bai_test': {
                    '$regex': term, 
                    '$options': 'i'
                  }
                }
              }
          
          if(term && term != ""){
              agg.push(aggTerm)
          }
          
          if(viTri && viTri != ""){
            let aggViTri = 
              {
                  '$match': {
                    '$expr': {
                      '$in': [
                        new mongoose.Types.ObjectId(viTri), '$vi_tri'
                      ]
                    }
                  }
                }
            agg.push(aggViTri)
          }

          let aggDetailViTri = [
            {
              '$unwind': {
                'path': '$vi_tri'
              }
            }, {
              '$lookup': {
                'from': 'vi-tri', 
                'localField': 'vi_tri', 
                'foreignField': '_id', 
                'as': 'vi_tri'
              }
            }, {
              '$unwind': {
                'path': '$vi_tri'
              }
            }, {
              '$group': {
                '_id': '$_id', 
                'vi_tri': {
                  '$push': '$vi_tri'
                }
              }
            }, {
              '$lookup': {
                'from': 'bai-test-dau-vao', 
                'localField': '_id', 
                'foreignField': '_id', 
                'as': 'detail'
              }
            }, {
              '$unwind': {
                'path': '$detail'
              }
            }, {
              '$addFields': {
                'detail.vi_tri': '$vi_tri'
              }
            }, {
              '$replaceRoot': {
                'newRoot': '$detail'
              }
            }
          ]

          agg = agg.concat(aggDetailViTri)
  
          let danhsach = await this.model
                                  .aggregate(agg)
                                  .exec()
          let totalPages = Math.ceil(danhsach.length/perPage)
          let start = (perPage * page) - perPage
          let end = start + perPage    
          danhsach = danhsach.slice(start, end)
          return {currentPage: page, totalPages: totalPages, danhsach:danhsach}
        } catch (error) {
         throw error
         return
        }
    }

    async danhSachCauHoi (idBaiTest){
      let agg = [
          {
            '$match': {
              '_id': new mongoose.Types.ObjectId(idBaiTest)
            }
          }, {
            '$lookup': {
              'from': 'cau-hoi', 
              'localField': '_id', 
              'foreignField': 'id_bai_test', 
              'as': 'cau_hoi'
            }
          }, {
            '$project': {
              '_id': 1, 
              'ma_bai_test': 1, 
              'so_diem_toi_thieu': 1, 
              'ten_bai_test': 1, 
              'thoi_luong': 1, 
              'cau_hoi._id': 1, 
              'cau_hoi.so_diem_cau_hoi': 1, 
              'cau_hoi.noi_dung': 1, 
              'cau_hoi.dap_an': 1
            }
          }
        ]

      let result = await this.model.aggregate(agg).exec()

      return result
    }

    async danhSachDapAn (idBaiTest){
      let agg = [
          {
            '$match': {
              '_id': new mongoose.Types.ObjectId(idBaiTest)
            }
          }, {
            '$lookup': {
              'from': 'cau-hoi', 
              'localField': '_id', 
              'foreignField': 'id_bai_test', 
              'as': 'cau_hoi'
            }
          }, {
            '$project': {
              '_id': 1, 
              'so_diem_toi_thieu': 1, 
              'cau_hoi._id': 1, 
              'cau_hoi.so_diem_cau_hoi': 1, 
              'cau_hoi.dap_an_dung': 1
            }
          }
        ]

      let result = await this.model.aggregate(agg).exec()

      return result
    }

}

module.exports = new BaiTestDauVaoModel();
