import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();


// Create a transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER, // Your Gmail address from environment variable
    pass: process.env.GMAIL_PASS,  // Your Gmail App Password from environment variable
  },
});

// Send an email
export const sendEmail = async (to:string, subject:string, html:string) => {

  // console.log(process.env.GMAIL_USER, process.env.GMAIL_PASS)
  const mailOptions = {
    from: process.env.GMAIL_USER,
    to,
    subject,
    html,  // Use `html` instead of `text` for HTML content
  };

  try {
    // Use `await` to wait for the email to be sent
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.response);
    
    // Return the result or proceed to another task
    return { success: true, message: 'Email sent successfully', info };
  } catch (error) {
    console.log('Error sending email:', error);
    
    // Handle the error or proceed to another task
    return { success: false, message: 'Failed to send email', error };
  }
};