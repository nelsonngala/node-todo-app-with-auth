const nodemailer = require('nodemailer');
const emailConfig = require('./emailConfig');

const sendEmail = async ({to, subject, html}) => {
    const transporter = nodemailer.createTransport(emailConfig);
    return transporter.sendMail({
        from: '"Nelson Ngala" <nelsonngala.98@gmail.com>',
        to,
        subject,
        html
    })
}

module.exports = sendEmail;