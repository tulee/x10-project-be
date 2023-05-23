const mongoose = require('mongoose');
const BaseModel = require('./base.model');
const UngVienSchema = require('./schemas/ungVien.schema');
class UngVienModel extends BaseModel {
    constructor(){
        super()
        this.init("ung-vien", UngVienSchema, "ung-vien");
    }

    async getDanhSachUngVien(term, page, perPage){
        try {
          const agg = [
            {
              '$match': {
                'ho_va_ten': {
                  '$regex': '', 
                  '$options': 'i'
                }
              }
            }
          ]
          const aggTerm = 
              {
                '$match': {
                  'ho_va_ten': {
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

    // async getUngVienByInfo(info){
    //     const query = this.model.findOne(info);
    //     return query.exec();
    // }
}

module.exports = new UngVienModel();
