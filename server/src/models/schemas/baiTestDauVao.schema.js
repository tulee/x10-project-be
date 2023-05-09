const mongoose = require('mongoose')
const BaiTestDauVaoSchema = new mongoose.Schema({    
    ma_bai_test:{
        type: String,
        required: true
    },
    ten_bai_test:{
        type: String,
        required: true
    },
    thoi_luong:{
        type: Number,
        required: true
    },
    mo_ta:String,
    ngay_tao_bai_test:Date,
    ngay_chinh_sua_gan_nhat:Date,
    so_diem_toi_thieu:Number,
    vi_tri:[mongoose.Types.ObjectId]
})
module.exports = BaiTestDauVaoSchema