const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();

module.exports = (req, res, next) => {
    const { TEAM_EMAIL, APP_PASSWORD } = process.env;
    const { email } = req.body;

    const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    auth: {
        user:TEAM_EMAIL,
        pass:APP_PASSWORD
    },
    });

    const mailOptions = {
        from : `White Rabbit 커뮤니티 <${TEAM_EMAIL}>`,
        to: email,
        subject: '[White Rabbit] 이메일 인증 번호 안내',
        text: '테스트 내용'
    };

    transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
            throw err;
        } else {
            //console.log('Email Sent : ', info);
            res.status(200).json({
            message: "메일 전송됨"
          });
        }
    })
}