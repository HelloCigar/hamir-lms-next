import { env } from "./env";
import nodemailer from "nodemailer";

export async function sendMail(receiver: string, otp: string) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: env.GMAIL_USER, // your Gmail
      pass: env.GMAIL_APP_PASSWORD,    // 16-char App Password
    },
  });

  const mailOptions = {
    from: `"HamirLMS" <${env.GMAIL_USER}>`,
    to: receiver,
    subject: "HamirLMS - Verify your email",
    html: `<p>Your OTP is <strong>${otp}</strong></p>`
  };

  await transporter.sendMail(mailOptions);
}