const mongoose = require('mongoose');
const BaseModel = require('./base.model');
const ViTriSchema = require('./schemas/viTri.schema');
class ViTriModel extends BaseModel {
    constructor(){
        super()
        this.init("vi-tri", ViTriSchema, "vi-tri");
    }

    async getViTriByMaViTri(ma_vi_tri){
      const query = this.model.findOne({ma_vi_tri: ma_vi_tri});
      return query.exec();
    }

    async getViTri(term, page, perPage){
        try {
          const agg = [
            {
              '$match': {
                'ten_vi_tri': {
                  '$regex': '', 
                  '$options': 'i'
                }
              }
            }
          ]
          const aggTerm = 
              {
                '$match': {
                  'ten_vi_tri': {
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
        } catch (error) {
         throw error
         return
        }
    }
}

module.exports = new ViTriModel();
