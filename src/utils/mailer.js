const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();

const user = process.env.TEAM_EMAIL;
const pass = process.env.APP_PASSWORD;

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    auth: {
        user,
        pass
    },
});

module.exports = async (email, authCode) => {
    const mailOptions = {
        from : `White Rabbit 커뮤니티 <${user}>`,
        to: email,
        subject: '[White Rabbit] 이메일 인증 코드 안내',
        html: 
        `<html>
            <body style="
                background-color: #f7f7ff;
                color: #000;
                font-family: Arial, sans-serif;
                text-align: center;
                margin: 0;
                padding: 0;
            ">
                <table style="
                    width: 100%;
                    max-width: 600px;
                    border-collapse: collapse;
                    margin: 0 auto;
                ">
                    <tr>
                        <td style="
                        background-color: #524fa1;
                        padding: 20px;
                        text-align: center;
                    ">
                        <img width="120" height="20" src="https://eatnfit.s3.ap-northeast-2.amazonaws.com/unnamed.png" alt="로고" style="
                            max-width: 100%;
                            height: auto;
                        ">
                    </td>
                </tr>
                        </td>
                    </tr>
                    <tr>
                        <td style="
                            background-color: #ffffff;
                            padding: 20px;
                            text-align: center;
                        ">
                            <p style="font-size: 18px; margin: 0;">요청하신 인증코드는</p>
                            <div style="
                                background-color: #f7f7ff;
                                color: #524fa1;
                                padding: 10px;
                                margin: 20px auto;
                                border-radius: 5px;
                                max-width: 200px;
                            ">
                                <strong style="font-size: 24px; color: #524fa1; margin: 0;">${authCode}</strong>
                            </div>
                            <p style="font-size: 18px; margin: 0;">입니다.</p>
                        </td>
                    </tr>
                </table>
            </body>
        </html>`
    };

    await transporter.sendMail(mailOptions)

    return;
}