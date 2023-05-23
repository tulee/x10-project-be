const mongoose = require('mongoose')
const YeuCauUngTuyenSchema = new mongoose.Schema({    
    id_dot_tuyen_dung_vi_tri:{
        type: mongoose.Types.ObjectId,
        required: true
    },
    id_bai_test:mongoose.Types.ObjectId,
    id_ung_vien:{
        type: mongoose.Types.ObjectId,
        required: true
    },
    diem_lam_test_dau_vao:Number,
    thoi_gian_lam_test:Date,
    trang_thai:String,
    hinh_thuc_pv:String,
    thoi_gian_pv:Date,
    nguoi_pv:String,
    ket_qua_pv:String,
    ngay_nhan_viec:Date
})
module.exports = YeuCauUngTuyenSchema