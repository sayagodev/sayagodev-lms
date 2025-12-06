import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { emailOTP } from "better-auth/plugins";
import { prisma } from "./db";
import { env } from "./env";
import resend from "./resend";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  socialProviders: {
    github: {
      clientId: env.AUTH_GITHUB_CLIENT_ID,
      clientSecret: env.AUTH_GITHUB_SECRET,
    },
  },
  plugins: [
    emailOTP({
      async sendVerificationOTP({ email, otp }) {
        await resend.emails.send({
          from: "SáyagodevLMS <noreply@sayago.dev>",
          to: [email],
          subject: "SáyagodevLMS - Verificación de correo electrónico",
          html: `<p>Tu código de verificación es: <strong>${otp}</strong></p>`,
        });
      },
    }),
  ],
});
