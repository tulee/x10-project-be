const model = require('../models/viTri.model');
const { default: mongoose } = require("mongoose");

class ViTriController {
    constructor() {}

    getViTri = async (req, res) => {
        let result = await model.getAll()
        res.send(result)
    }
  }

module.exports = new ViTriController();