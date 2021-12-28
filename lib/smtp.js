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
    mail ({ from, to, subject, content}){
        let info = await transporter.sendMail({
            from: '"Fred Foo 👻" <foo@example.com>', // sender address
            to: "bar@example.com, baz@example.com", // list of receivers
            subject: "Hello ✔", // Subject line
            text: "Hello world?", // plain text body
            html: "<b>Hello world?</b>", // html body
          });
        
          console.log("Message sent: %s", info.messageId);
    }
}