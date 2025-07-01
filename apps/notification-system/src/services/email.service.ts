const sgMail = require('@sendgrid/mail');
sgMail.setApiKey('YOUR_SENDGRID_API_KEY');

const msgEnv = {
  from: process.env.HOSTEMAIL,
};


const sendEmail = async (to: string, subject: string, html: string) => {
    const msg = {
        to,
        from: msgEnv.from,
        subject,
        html,
    };
    sgMail.send(msg)
      .then(() => console.log('Email sent'))
      .catch((error:Error) => console.error(error));
}