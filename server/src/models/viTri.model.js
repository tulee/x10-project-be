const mongoose = require('mongoose');
const BaseModel = require('./base.model');
const ViTriSchema = require('./schemas/viTri.schema');
class ViTriModel extends BaseModel {
    constructor(){
        super()
        this.init("vi-tri", ViTriSchema, "vi-tri");
    }
}

module.exports = new ViTriModel();
