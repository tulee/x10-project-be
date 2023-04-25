const mongoose = require('mongoose')
const UngVienSchema = new mongoose.Schema({    
    email:{
        type: String,
        required: true
    },
    sdt:{
        type: String,
        required: true
    },
    gioi_tinh:{
        type: String,
        required: true
    },
    ho_va_ten:{
        type: String,
        required: true
    },
    nam_sinh:String,
    trang_thai:String,
    cv:String
})
module.exports = UngVienSchema