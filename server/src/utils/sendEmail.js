import nodemailer from "nodemailer";
import hbs from "nodemailer-express-handlebars";
import setPath from "./setPath.js";

export default function sendEmail() {
  const transporter = nodemailer.createTransport({
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
  });

  transporter.verify(function (error) {
    if (error) {
      console.log(error);
    } else {
      console.log("Server is ready");
    }
  });

  const viewPath = setPath("./views/");
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

  const user = { name: "Kenneth" };
  const mailOptions = {
    from: '"Quizzer Admin" <admin@kernie.net>', // sender address
    to: "kenneth@kernie.net", // list of receivers
    subject: `Welcome to My Company, ${user.name}`,
    template: "resetEmail", // the name of the template file, i.e., email.handlebars
    // text_template: "text",
    context: {
      name: user.name,
      company: "my company",
    },
  };

  transporter.sendMail(mailOptions, function (err, info) {
    if (err) console.log(err);
    else console.log(info);
  });
}
