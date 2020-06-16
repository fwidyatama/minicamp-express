const nodemailer = require('nodemailer');

const sendEmail = async (options) => {

    // create reusable transporter object using the default SMTP transport
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.MAILTRAP_USERNAME,
            pass: process.env.MAILTRAP_PASSWORD,
        },
    });

   let info = await transporter.sendMail({
        from: '"Tes hehe 👻" <tes@hehe.com>',
        to: options.to,
        subject: 'Reset Password',
        text: options.text
    })
}

module.exports = sendEmail;