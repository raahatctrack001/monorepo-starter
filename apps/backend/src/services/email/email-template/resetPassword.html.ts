export const resetPasswordHTML = (name: string, resetPasswordURL: string) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reset Your Password</title>
    <style>
        body {
            font-family: 'Helvetica Neue', Arial, sans-serif;
            background-color: #e0f7fa;
            color: #006064;
            margin: 0;
            padding: 20px;
        }
        .container {
            background-color: #ffffff;
            padding: 30px;
            border-radius: 8px;
            max-width: 600px;
            margin: 0 auto;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
        }
        .header h1 {
            color: #fbc02d; /* Yellow color for warning */
            margin: 0;
        }
        .content {
            font-size: 16px;
            line-height: 1.8;
        }
        .content p {
            margin-bottom: 20px;
        }
        .button {
            display: block;
            width: fit-content;
            padding: 12px 24px;
            font-size: 16px;
            color: #FFFFFF; /* White text color */
            background-color: #FFD700;
            border-radius: 5px;
            text-decoration: none;
            margin: 20px auto; /* Center the button */
            text-align: center;
        }
        .footer {
            margin-top: 30px;
            font-size: 12px;
            color: #004d40;
            text-align: center;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Password Reset Request</h1>
        </div>
        <div class="content">
            <p>Hi ${name},</p>
            <p>It seems like you’ve requested a password reset. If this was you, simply click the button below to set a new password:</p>
            <p><a href="${resetPasswordURL}" class="button">Reset Your Password</a></p>
            <p>If you didn’t make this request, no worries—you can safely ignore this email.</p>
            <p>For your security, this link will expire in 30 minutes. Act promptly to regain access to your account.</p>
        </div>
        <div class="footer">
            <p>Having trouble with the button? Copy and paste the following link into your browser:</p>
            <p>${resetPasswordURL}</p>
        </div>
    </div>
</body>
</html>
`;