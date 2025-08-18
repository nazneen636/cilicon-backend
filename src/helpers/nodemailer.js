const nodemailer = require("nodemailer");
const { customError } = require("./customError");
const transporter = nodemailer.createTransport({
  service: "gmail",
  secure: process.env.NODE_ENV == "development" ? false : true, // true for 465, false for other ports
  auth: {
    user: process.env.HOST_MAIL,
    pass: process.env.APP_PASSWORD,
  },
});

exports.mailer = async (template, email, subject = "Confirm Registration") => {
  try {
    const info = await transporter.sendMail({
      from: "No reply",
      to: email,
      subject: subject,
      text: "Hello world?", // plain‑text body
      html: template, // HTML body
    });

    console.log("Message sent:", info.messageId);
  } catch (err) {
    throw new customError(401, "verification mail not sent");
  }
};
