const mongoose = require('mongoose');
const BaseModel = require('./base.model');
const BaiTestDauVaoSchema = require('./schemas/baiTestDauVao.schema');
class BaiTestDauVaoModel extends BaseModel {
    constructor(){
        super()
        this.init("bai-test-dau-vao", BaiTestDauVaoSchema, "bai-test-dau-vao");
    }

    async getBaiTest(term, viTri,page, perPage){
        const agg = [
          {
            '$match': {
              'ten_bai_test': {
                '$regex': '', 
                '$options': 'i'
              }
            }
          }
        ]
        const aggTerm = 
            {
              '$match': {
                'ten_bai_test': {
                  '$regex': term, 
                  '$options': 'i'
                }
              }
            }
        
        const aggViTri = 
            {
                '$match': {
                  '$expr': {
                    '$in': [
                      new mongoose.Types.ObjectId(viTri), '$vi_tri'
                    ]
                  }
                }
              }
        
        if(term && term != ""){
            agg.push(aggTerm)
        }

        if(viTri && viTri != ""){
            agg.push(aggViTri)
        }

        let danhsach = await this.model
                                .aggregate(agg)
                                .exec()
        let totalPages = danhsach.length 
        let start = (perPage * page) - perPage
        let end = start + perPage    
        danhsach = danhsach.slice(start, end)
        return {currentPage: page, totalPages: totalPages, danhsach:danhsach}
    }
}

module.exports = new BaiTestDauVaoModel();
