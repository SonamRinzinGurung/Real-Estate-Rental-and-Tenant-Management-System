import nodemailer from "nodemailer";
import dotenv from "dotenv"; //to use environment variables
import { Resend } from "resend";
dotenv.config();

const ENV = process.env.NODE_ENV || process.env.ENVIRONMENT;

const resend = new Resend(process.env.RESEND_API);

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/**
 * Send email using nodemailer transporter GMAIL
 */
export const sendEmail = async (to, from, subject, body) => {
  try {
    if (ENV === "production") {
      return await resend.emails.send({
        from: 'Property Plus <' + process.env.RESEND_EMAIL_HOST + '>',
        to: [to],
        replyTo: from,
        subject: subject,
        html: body,
      });
    }

    return await transporter.sendMail({
      from,
      to,
      subject,
      html: body,
      replyTo: from,
    });
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};
