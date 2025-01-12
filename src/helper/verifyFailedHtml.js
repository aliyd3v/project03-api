exports.verifyFailedHtml = `
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verification Failed</title>
    <style>
        body {
            font-family: 'Arial', sans-serif;
            margin: 0;
            padding: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            background-color: #f8d7da;
            color: #842029;
        }
        .container {
            text-align: center;
            background: #fff;
            padding: 40px 20px;
            border-radius: 10px;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
            max-width: 400px;
            border: 1px solid #f5c2c7;
        }
        .container h1 {
            font-size: 24px;
            margin: 0 0 10px;
            color: #dc3545;
        }
        .container p {
            margin: 10px 0;
            font-size: 16px;
            color: #6c757d;
        }
        .container a {
            display: inline-block;
            margin-top: 20px;
            padding: 10px 20px;
            font-size: 16px;
            color: #fff;
            background-color: #dc3545;
            text-decoration: none;
            border-radius: 5px;
            transition: background-color 0.3s ease;
        }
        .container a:hover {
            background-color: #bd2130;
        }
        .icon {
            font-size: 50px;
            margin-bottom: 20px;
            color: #dc3545;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="icon">⚠️</div>
        <h1>Verification Failed</h1>
        <p>We're sorry, but your verification has failed.</p>
        <a href="/">Return to Home</a>
    </div>
</body>
</html>
`