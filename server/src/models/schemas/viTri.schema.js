const mongoose = require('mongoose')
const ViTriSchema = new mongoose.Schema({    
    ma_vi_tri:{
        type: String,
        required: true
    },
    ten_vi_tri:{
        type: String,
        required: true
    },
    mo_ta:String
})
module.exports = ViTriSchema