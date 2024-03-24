
const nodemailer = require("nodemailer");
const dotenv = require('dotenv');
dotenv.config();

module.exports = sendEmailService = async (email, message, yourname) => {

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // Use `true` for port 465, `false` for all other ports
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
  const info = await transporter.sendMail({
    from: `"Tech Blog 👻" <${email}>`, // sender address
    to: "khoana23062002@gmail.com", // list of receivers
    subject: ` Hello Tech Blog`, // Subject line
    text: `${yourname} Hello Tech Blog✔`, // plain text body
    html: `<div>${message}</div>`, // html body
  });
  return info;
}