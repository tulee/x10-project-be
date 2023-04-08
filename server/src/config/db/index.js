const mongoose = require("mongoose");
class database {
  constructor() {}
  connect = async () => {
    await mongoose.connect(
      "mongodb+srv://admin:1234567890@cluster01.hgzawgg.mongodb.net/quan-ly-tuyen-dung?retryWrites=true&w=majority"
    );
  };
}

module.exports = database;