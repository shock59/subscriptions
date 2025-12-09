import nodemailer from "nodemailer";
import { env } from "$env/dynamic/private";

const transporter = nodemailer.createTransport({
  host: env.EMAIL_HOST,
  port: Number(env.EMAIL_PORT),
  secure: env.EMAIL_SECURE == "true",
  auth: {
    user: env.EMAIL_USERNAME,
    pass: env.EMAIL_PASSWORD,
  },
});

export default async function sendEmail(
  to: string,
  subject: string,
  text: string,
  html: string | undefined = undefined,
) {
  await transporter.sendMail({
    from: `"Subscriptions" <${env.EMAIL_USERNAME}>`,
    to,
    subject,
    text,
    html,
  });
}
