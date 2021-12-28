const nodemailer = require("nodemailer");

class Emailer{
    constructor(config){
        this.transporter = nodemailer.createTransport({
            host: "smtp.mailtrap.io",
            port: 2525,
            auth: {
              user: "91c96e8f9b1840",
              pass: "52b2fa78fe1dfb"
            }
          });
    }
}