const { default: mongoose } = require("mongoose");

class BaseModel {
  constructor() {}

  init(name, schema, fixName) {
    this.model = mongoose.model(name, schema, fixName);
  }

  //get all
  getAll() {
    let query = this.model.find();
    return query.exec();
  }
  
  //R = Research
  get(id) {
    let query = this.model.findById(id);
    return query.exec();
  }

  //C = Create
  create(data) {
    let result = this.model.create(data);
    return result;
  }

  //U = Update
  update(id, data) {
    let result = this.model.updateOne({ _id: id }, data);
    return result;
  }

  //D = Delete
  delete(id) {
    let result = this.model.deleteOne({ _id: id });
    return result;
  }

  //find with condition and update
  findAndUpdate(condition, data){
    let result = this.model.findOneAndUpdate(condition, data)
    return result
  }
}

module.exports = BaseModel;
