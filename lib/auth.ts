import { betterAuth } from "better-auth";
import { emailOTP, admin } from "better-auth/plugins"
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./db";
import { env } from "./env";
import { resend } from "./resend";


export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: 'postgresql'
    }),
    socialProviders: {
        github: {
            clientId: env.GITHUB_CLIENT_ID,
            clientSecret: env.GITHUB_CLIENT_SECRET
        }
    },
    plugins: [
        emailOTP({
           async sendVerificationOTP({email, otp}) {
                await resend.emails.send({
                    from: "HamirLMS <onboarding@resend.dev>",
                    to: [email],
                    subject: "HamirLMS - Verify your email",
                    html: `<p>Your OTP is <strong>${otp}</strong></p>`
                })
           }, 
        }),
        admin()
    ]
});