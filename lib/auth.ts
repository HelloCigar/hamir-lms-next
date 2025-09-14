import { betterAuth } from "better-auth";
import { emailOTP, admin } from "better-auth/plugins"
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./db";
import { env } from "./env";
import { sendMail } from "./emailOtpHandler";

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: 'postgresql'
    }),
    socialProviders: {
        github: {
            clientId: env.GITHUB_CLIENT_ID,
            clientSecret: env.GITHUB_CLIENT_SECRET
        },
        google: {
            clientId: env.GOOGLE_CLIENT_ID,
            clientSecret: env.GOOGLE_CLIENT_SECRET
        }
    },
    plugins: [
        emailOTP({
           async sendVerificationOTP({email, otp}) {
                await sendMail(email, otp)
                    .catch(console.log);
           }, 
        }),
        admin()
    ]
});