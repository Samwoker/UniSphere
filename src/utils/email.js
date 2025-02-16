require("dotenv").config({ path: "../../.env" });

const nodemailer = require("nodemailer");

const sendMail = async (options) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST, 
    port: parseInt(process.env.EMAIL_PORT, 10), 
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const emailOptions = {
    from: `UniSphere Support <samwoker112@gmail.com>`, 
    to: options.emailId,
    subject: options.subject,
    text: options.message,
  };

  try {
    const info = await transporter.sendMail(emailOptions);
    console.log("Email sent successfully! Message ID:", info.messageId);
  } catch (error) {
    console.error(" Error sending email:", error);
  }
};

module.exports = sendMail;
