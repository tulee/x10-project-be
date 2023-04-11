const { default: mongoose } = require("mongoose");
const validator = require("validator")
const service = require('../services/mail.service')

class MailController {
    constructor() {}

    mailTemplate = async (req, res) => {
      let data = req.body

      // if(!validator.isEmail(data.email)){
      //   const err= new Error("Invalid email address.");
      //   err.status = 400;
      //   res.send({status:"fail", message:"Địa chỉ email không đúng"})
      // }
      
      let result  = await service.mailTemplate(data.nguoiNhan, data.mauEmail)

      if(result){
        res.send({
          status:"true", message: "Email successfully sent."
        })
      } else {
        res.send({
          status:"false", message: "Fail to send mail"
        })
      }
    }
  }

module.exports = new MailController();