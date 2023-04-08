const { default: mongoose } = require("mongoose");
const nodemailer = require("nodemailer");

class MailService {

    guiMail = (email) => {
        var transporter = nodemailer.createTransport({
            host: "sandbox.smtp.mailtrap.io",
            port: 2525,
            auth: {
              user: "45018bad9002d8",
              pass: "3213422d7a2bba"
            }
        })

        const mailOptions= {
            from: '"Test Server" <test@example.com>',
            to: email,
            subject: "Email Test",
            text: "This is an email test using Mailtrap.io"
            };
        
        transporter.sendMail(mailOptions, (err, info) => {
            if(err){
                console.log(err);
                return reject();
            }
            console.log("Info: ", info);
            return ({
                status:true, message: "Email successfully sent."
            });
        });
    }
  }

module.exports = new MailService();