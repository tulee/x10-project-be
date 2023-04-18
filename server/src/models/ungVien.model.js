const mongoose = require('mongoose');
const BaseModel = require('./base.model');
const UngVienSchema = require('./schemas/ungVien.schema');
class UngVienModel extends BaseModel {
    constructor(){
        super()
        this.init("ung-vien", UngVienSchema, "ung-vien");
    }

    // async getUngVienByInfo(info){
    //     const query = this.model.findOne(info);
    //     return query.exec();
    // }
}

module.exports = new UngVienModel();
