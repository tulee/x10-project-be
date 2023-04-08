const mongoose = require('mongoose');
const BaseModel = require('./base.model');
const DotTuyenDung_ViTriSchema = require('./schemas/dotTuyenDung_ViTri.schema');
class DotTuyenDung_ViTriModel extends BaseModel {
    constructor(){
        super()
        this.init("dot-tuyen-dung_vi-tri", DotTuyenDung_ViTriSchema, "dot-tuyen-dung_vi-tri");
    }
}

module.exports = new DotTuyenDung_ViTriModel();
