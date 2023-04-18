const mongoose = require('mongoose');
const BaseModel = require('./base.model');
const CauHoiSchema = require('./schemas/cauHoi.schema');
class CauHoiModel extends BaseModel {
    constructor(){
        super()
        this.init("cau-hoi", CauHoiSchema, "cau-hoi");
    }

}

module.exports = new CauHoiModel();
