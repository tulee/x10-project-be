const { default: mongoose } = require("mongoose");
const nodemailer = require("nodemailer");
const Email = require('email-templates');
const path = require('path')

class MailService {
    guiMail = async (email, name) => {
        // var transporter = await nodemailer.createTransport({
        //     host: "sandbox.smtp.mailtrap.io",
        //     port: 2525,
        //     auth: {
        //       user: "45018bad9002d8",
        //       pass: "3213422d7a2bba"
        //     }
        // })

        const mailOptions = {
            from: '"Test Server" <test@example.com>',
            to: email,
            subject: "Email Test",
            text: `Xin chào ${name} làm test vui vẻ nhé`
        };

        async function wrapedSendMail(mailOptions) {
            return new Promise((resolve, reject) => {
                var transporter = nodemailer.createTransport({
                    host: "sandbox.smtp.mailtrap.io",
                    port: 2525,
                    auth: {
                        user: "45018bad9002d8",
                        pass: "3213422d7a2bba"
                    }
                })

                transporter.sendMail(mailOptions, (err, info) => {
                    if (err) {
                        resolve(false)
                    }
                    console.log("Info: ", info);
                    resolve(true)
                });
            })
        }

        let result = await wrapedSendMail(mailOptions)
        return result
        // await transporter.sendMail(mailOptions, (err, info) => {
        //     if(err){
        //         console.log(err);
        //         return ({
        //             status:"fail", message: "Error sending email."
        //         });
        //     }
        //     console.log("Info: ", info);
        //     return ({
        //         status:"true", message: "Email successfully sent."
        //     });
        // });


    }

    mailTemplate = async (nguoiNhan, mauEmail) => {
        async function wrapedSendMail() {
            return new Promise((resolve, reject) => {
                const email = new Email({
                    views: {
                        root: path.join('', 'src/emails/'),
                    },
                    message: {
                        from: '"Test Server" <test@example.com>',
                    },
                    preview: false,
                    send: true,
                    transport: {
                        host: "sandbox.smtp.mailtrap.io",
                        port: 2525,
                        auth: {
                            user: "45018bad9002d8",
                            pass: "3213422d7a2bba"
                        }
                    }
                });


                nguoiNhan.forEach((person) => {
                    email
                        .send({
                            template: mauEmail,
                            message: {
                                to: person.mail
                            },
                            locals: person
                        })
                        .then(console.log)
                        .catch(() => {
                            console.error
                            resolve(false)
                        });
                })

                resolve(true)
            })
        }

        let result = await wrapedSendMail()

        return result
    }


}

module.exports = new MailService();