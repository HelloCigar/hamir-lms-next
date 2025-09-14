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
    html: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333;">Email Verification</h2>
            <p>Welcome to HamirLMS!</p>
            <p>Your verification code is:</p>
            <div style="background-color: #f4f4f4; padding: 20px; text-align: center; margin: 20px 0;">
              <span style="font-size: 24px; font-weight: bold; color: #2563eb; letter-spacing: 2px;">${otp}</span>
            </div>
            <p>This code will expire in 10 minutes.</p>
            <p>If you didn't request this verification, please ignore this email.</p>
          </div>`
  };

  await transporter.sendMail(mailOptions);
}