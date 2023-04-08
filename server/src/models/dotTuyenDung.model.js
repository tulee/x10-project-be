const mongoose = require('mongoose');
const BaseModel = require('./base.model');
const DotTuyenDungSchema = require('./schemas/dotTuyenDung.schema');
class DotTuyenDungModel extends BaseModel {
    constructor(){
        super()
        this.init("dot-tuyen-dung", DotTuyenDungSchema, "dot-tuyen-dung");
    }
}

module.exports = new DotTuyenDungModel();
