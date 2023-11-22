import nodemailer from "nodemailer";
import hbs from "nodemailer-express-handlebars";
import setPath from "./setPath.js";

export const emailOptions = {
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

export default function sendEmail(email, subject, params, template) {
  const transporter = nodemailer.createTransport(emailOptions);

  transporter.verify(function (error) {
    if (error) {
      console.log(error);
    } else {
      console.log("Server is ready");
    }
  });

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

  transporter.sendMail(mailOptions, function (err, info) {
    if (err) console.log(err);
    else console.log(info);
  });
}
