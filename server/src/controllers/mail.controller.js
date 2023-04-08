const { default: mongoose } = require("mongoose");
const validator = require("validator")
const service = require('../services/mail.service')

class MailController {
    constructor() {}

    guiMail = async (req, res) => {
      let data = req.body

      if(!validator.isEmail(data.email)){
        const err= new Error("Invalid email address.");
        err.status = 400;
        res.send({status:fail, message:"Địa chỉ email không đúng"})
      }
      
      let result = service.guiMail(data.email)

      res.send(result)
    }
  }

module.exports = new MailController();