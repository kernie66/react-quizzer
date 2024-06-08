import nodemailer from "nodemailer";
import hbs from "nodemailer-express-handlebars";
import setPath from "./setPath.js";
import { logger } from "../logger/logger.js";

export const getEmailOptions = () => {
  return {
    //host: "smtp.mail.me.com",
    //port: 587,
    //secure: false,
    //requireTLS: true,
    service: "iCloud",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    logger: true,
  };
};

export async function checkEmail() {
  try {
    const emailOptions = getEmailOptions();
    const transporter = nodemailer.createTransport(emailOptions);

    // Check that email server accepts options
    try {
      await transporter.verify();
      logger.info("Email server is ready");
    } catch (error) {
      logger.error("Email server reports:", error);
      throw new Error("Email server validation error");
    }

    return { emailServerOk: true, text: "Email server set up correctly" };
  } catch (error) {
    return { emailServerOk: false, text: error };
  }
}

export async function sendEmail(email, subject, params, template) {
  try {
    const emailOptions = getEmailOptions();
    const transporter = nodemailer.createTransport(emailOptions);

    const viewPath = setPath("./templates/");
    // point to the template folder
    const handlebarOptions = {
      viewEngine: {
        partialsDir: viewPath,
        defaultLayout: false,
      },
      viewPath: viewPath,
    };

    // use a template file with nodemailer
    transporter.use("compile", hbs(handlebarOptions));

    const mailOptions = {
      from: '"Quizzer Admin" <admin@kernie.net>', // sender address
      to: email, // list of receivers
      subject: subject,
      template: template, // the name of the template file, i.e., email.handlebars
      // text_template: "text",
      context: params,
    };

    try {
      await transporter.sendMail(mailOptions);
    } catch (error) {
      logger.error("Send email reports:", error);
      throw new Error("Error sending email");
    }

    return { emailSent: true, text: "Email sent successfully" };
  } catch (error) {
    return { emailSent: false, text: error };
  }
}
