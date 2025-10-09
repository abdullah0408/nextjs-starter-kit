import {
  EmailVerificationEmail,
  ResetPasswordEmail,
  WelcomeEmail,
} from "@/components/email-templates";
import { sendEmail } from "@/lib/email";
import { env } from "@/lib/env";
import prisma from "@/lib/prisma";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";

/**
 * Better Auth configuration for this Next.js app.
 * For more options and setup guide, see: https://www.better-auth.com/docs/introduction
 * & https://www.better-auth.com/docs/integrations/next
 */
export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    async sendResetPassword({ user, url }) {
      await sendEmail({
        from: env.NEXT_PUBLIC_EMAIL_FROM,
        to: user.email,
        subject: "Reset your password",
        react: ResetPasswordEmail({ resetUrl: url }),
      });
    },
  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    async sendVerificationEmail({ user, url }) {
      await sendEmail({
        from: env.NEXT_PUBLIC_EMAIL_FROM,
        to: user.email,
        subject: "Verify your email address",
        react: EmailVerificationEmail({ verificationUrl: url }),
      });
    },
    async afterEmailVerification(user) {
      await sendEmail({
        from: env.NEXT_PUBLIC_EMAIL_FROM,
        to: user.email,
        subject: "Welcome to NextJS Starter Kit!",
        react: WelcomeEmail({
          userName: user.name || user.email.split("@")[0],
        }),
      });
    },
  },

  /**
   * To enable social login (e.g., GitHub, Google):
   * - You must set the corresponding CLIENT_ID and CLIENT_SECRET in your environment (.env),
   *   as shown in .env.example.
   * - If you do not want to use a particular provider, it is recommended to comment out that provider.
   * - For more social OAuth providers and advanced authentication options, see:
   *   https://www.better-auth.com/docs/introduction
   *   & https://www.better-auth.com/docs/integrations/next
   */
  socialProviders: {
    github: {
      clientId: env.GITHUB_CLIENT_ID,
      clientSecret: env.GITHUB_CLIENT_SECRET,
    },
    google: {
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    },
  },
});
