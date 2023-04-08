const mongoose = require('mongoose')
const DotTuyenDung_ViTriSchema = new mongoose.Schema({    
    id_dot_tuyen_dung:{
        type: mongoose.Types.ObjectId,
        required: true
    },
    id_vi_tri:{
        type: mongoose.Types.ObjectId,
        required: true
    },
    so_luong:Number
})
module.exports = DotTuyenDung_ViTriSchema