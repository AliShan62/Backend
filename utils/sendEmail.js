const nodemailer = require('nodemailer');

const sendEmail = async (options) => {

    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: 'alishanit63@gmail.com', // Fixed the typo here
            pass: 'ftrl huqc tlpw susf'
        }
    });

    const mailOptions = {
        from: 'alishanit63@gmail.com', // Fixed the typo here
        to: options.email,
        subject: 'ECOMMERCE APP PASSWORD RECOVERY',
        html: `<p>Hi ${options.name}, Please copy this link to reset your password: http://localhost:8080/reset-password </p>`,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        //console.log("Mail has been sent successfully!");
        // console.log(info);
    } catch (error) {
        console.error(error);
    }
};

module.exports = sendEmail;
