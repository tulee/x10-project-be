const { default: mongoose } = require("mongoose");

class BaseModel {
  constructor() {}

  init(name, schema, fixName) {
    this.model = mongoose.model(name, schema, fixName);
  }

  //get all
  async getAll() {
    let query = this.model.find();
    return query.exec();
  }
  
  //R = Research
  async getById(id) {
    let query = this.model.findById(id);
    return query.exec();
  }

  async getByInfo(info){
    let query = this.model.findOne(info);
    return query.exec();
  }

  //C = Create
  async create(data) {
    let result = this.model.create(data);
    return result;
  }

  //U = Update
  async update(id, data) {
    let result = this.model.updateOne({ _id: id }, data);
    return result;
  }

  //D = Delete
  async delete(id) {
    let result = this.model.deleteOne({ _id: id });
    return result;
  }

  //find with condition and update
  async findAndUpdate(condition, data){
    let result = this.model.findOneAndUpdate(condition, data)
    return result
  }
}

module.exports = BaseModel;
