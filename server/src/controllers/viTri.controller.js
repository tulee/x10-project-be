const viTriModel = require('../models/viTri.model');
const { default: mongoose } = require("mongoose");

class ViTriController {
    constructor() {}

    getViTri = async (req, res) => {
      let term = req.query.term
      let perPage = 3;
      let page = req.query.page || 1; 
      let result = await viTriModel.getViTri(term,page, perPage)
      if(result.totalPages>0){
        res.send({status:"true", data: result, message:"Tìm vị trí thành công"})
      } else {
        res.status(404).json({status:"false", message:"Không tìm thấy đợt tuyển dụng"})
        return
      }
    }
  }

module.exports = new ViTriController();