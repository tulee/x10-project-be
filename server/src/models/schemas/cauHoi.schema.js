const mongoose = require('mongoose')
const cauHoiSchema = new mongoose.Schema({    
    id_bai_test:{
        type: mongoose.Types.ObjectId,
        required: true
    },
    noi_dung:{
        type: String,
        required: true
    },
    so_diem_cau_hoi:Number,
    dap_an:[
        {
            ma_dap_an:String,
            noi_dung:String
        }
    ],
    dap_an_dung:String
})
module.exports = cauHoiSchema