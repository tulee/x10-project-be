const mongoose = require('mongoose');
const BaseModel = require('./base.model');
const YeuCauUngTuyenSchema = require('./schemas/yeuCauUngTuyen');
class YeuCauUngTuyenModel extends BaseModel {
    constructor(){
        super()
        this.init("yeu-cau-ung-tuyen", YeuCauUngTuyenSchema, "yeu-cau-ung-tuyen");
    }
}

module.exports = new YeuCauUngTuyenModel();
