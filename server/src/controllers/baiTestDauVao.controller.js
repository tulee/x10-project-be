const model = require('../models/baiTestDauVao.model');
const { default: mongoose } = require("mongoose");

class BaiTestDauVaoController {
    constructor() {}

    getBaiTest = async (req, res) => {
        try {
          let term = req.query.term
          let viTri = req.query.vitri
          let perPage = 3;
          let page = req.query.page || 1; 
          let result = await model.getBaiTest(term,viTri,page, perPage)
          if(result.totalPages>0){
            res.send({status:"true", data: result, message:"Tìm bài test thành công"})
          } else {
            res.send({status:"false", message:"Không tìm thấy bài test"})
          }         
        } catch (error) {
          console.log(error);
          res.send({status:"false", message:"Lỗi khi tìm bài test"})
        }
  }
}
module.exports = new BaiTestDauVaoController();