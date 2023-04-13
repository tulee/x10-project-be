const mongoose = require('mongoose')
const CbnvSchema = new mongoose.Schema({    
    username:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    refreshToken:String
})
module.exports = CbnvSchema