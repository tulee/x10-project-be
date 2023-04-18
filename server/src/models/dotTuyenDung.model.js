const mongoose = require('mongoose');
const BaseModel = require('./base.model');
const DotTuyenDungSchema = require('./schemas/dotTuyenDung.schema');
class DotTuyenDungModel extends BaseModel {
    constructor(){
        super()
        this.init("dot-tuyen-dung", DotTuyenDungSchema, "dot-tuyen-dung");
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
        let totalPages = danhsach.length 
        let start = (perPage * page) - perPage
        let end = start + perPage    
        danhsach = danhsach.slice(start, end)
        return {currentPage: page, totalPages: totalPages, danhsach:danhsach}
    }
}

module.exports = new DotTuyenDungModel();
