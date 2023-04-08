const mongoose = require('mongoose')
const DotTuyenDungSchema = new mongoose.Schema({    
    ten:{
        type: String,
        required: true
    },
    ngay_bat_dau:{
        type: Date,
        required: true
    },
    ngay_ket_thuc:{
        type: Date,
        required: true
    },
    ngay_chinh_sua_gan_nhat:Date,
    mo_ta_khac:String
})
module.exports = DotTuyenDungSchema