const nodemailer = require('nodemailer');
const { emailCompany, emailPassword } = require('../config/config');

const transporter = nodemailer.createTransport({
    host: 'smtp.mail.ru',
    port: 587,
    secure: false,
    auth: {
        user: emailCompany,
        pass: emailPassword
    }
});

exports.sendVerifyToEmail = (customerEmail, verifyUrl) => {
    const mailOptions = {
        from: `'AIF Restaurant' <${emailCompany}>`,
        to: customerEmail,
        subject: 'Verify your email',
        html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verification Page</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f3f4f6;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
        }

        .container {
            background-color: #ffffff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            text-align: center;
        }

        h1 {
            color: #333333;
        }

        p {
            color: #555555;
        }

        .verify-button {
            background-color: limegreen;
            color: white;
            font-size: 18px;
            padding: 10px 20px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            transition: background-color 0.3s;
        }

        .verify-button:hover {
            background-color: darkred;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Verify Your Email</h1>
        <p>Click the button below to verify your email address:</p>
        <a class="verify-button" style="text-decoration:none; color=white;" href="${verifyUrl}">Verify</a>
    </div>
</body>
</html>
`
    };
    const send = transporter.sendMail(mailOptions);
}