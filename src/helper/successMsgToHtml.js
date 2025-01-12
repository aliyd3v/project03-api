exports.succesMsgToHtml = (customerName, attribute) => {
    return `<html lang="en">
            <head>
                <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <title>${attribute} Success</title>
                        <style>
                            body {
                                font - family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                            margin: 0;
                            padding: 0;
                            background-color: #f0f9ff;
                            color: #333;
        }
                            .container {
                                max - width: 600px;
                            margin: 50px auto;
                            background: #ffffff;
                            padding: 25px;
                            border-radius: 12px;
                            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        }
                            .header {
                                text - align: center;
                            padding: 15px 0;
        }
                            .header h1 {
                                margin: 0;
                            font-size: 26px;
                            color: #0078d7;
        }
                            .content {
                                margin - top: 20px;
                            text-align: center;
        }
                            .content p {
                                margin: 10px 0;
                            font-size: 16px;
                            line-height: 1.6;
        }
                            .order-details {
                                margin - top: 25px;
        }
                            .order-details h2 {
                                font - size: 20px;
                            margin-bottom: 15px;
                            color: #0078d7;
                            text-align: center;
        }
                            .meals {
                                list - style: none;
                            padding: 0;
                            margin: 0;
                            text-align: left;
        }
                            .meals li {
                                background: #e6f7ff;
                            margin: 8px 0;
                            padding: 12px;
                            border-radius: 8px;
                            font-size: 16px;
                            color: #333;
        }
                            .footer {
                                text - align: center;
                            margin-top: 30px;
                            font-size: 14px;
                            color: #555;
        }
                            .footer p {
                                margin: 5px 0;
        }
                        </style>
                    </head>
                    <body>
                        <div class="container">
                            <div class="header">
                                <h1>${attribute} Successfully Received!</h1>
                            </div>
                            <div class="content">
                                <p>Dear <strong>${customerName}</strong>,</p>
                                <p>We are delighted to inform you that your ${attribute} has been successfully received.</p>
                            </div>
                            <div class="footer">
                                <p>If you have any questions, feel free to contact our support team.</p>
                                <p>We look forward to serving you again soon!</p>
                            </div>
                        </div>
                    </body>
                </html>`
};
