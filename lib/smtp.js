const nodemailer = require("nodemailer");

class Emailer{
    constructor(config){
        this.transporter = nodemailer.createTransport({
            host: "smtp.mailtrap.io",
            port: 25,
            auth: {
              user: "91c96e8f9b1840",
              pass: "52b2fa78fe1dfb"
            }
          });
    }
    send ({ fromName, fromAddress, recievers, subject, html}){
        return  this.transporter.sendMail({
            from: {
              name: fromName,
              address: fromAddress
            },
            to: recievers,
            subject: subject,
            html: html
          });        
          
    }
}
exports.Emailer = Emailer;