import { authPaths } from "@/routes/paths";
import { Resend } from "resend";

const NEXT_PUBLIC_APP_URL = process.env.NEXT_PUBLIC_APP_URL;
const RESEND_API_KEY = process.env.RESEND_API_KEY;

const resend = new Resend(RESEND_API_KEY);

export const sendVerificationEmail = async (email: string, token: string) => {
  const registerVerificationPath = authPaths.registerVerification();
  const verificationEmailLink = `${NEXT_PUBLIC_APP_URL}${registerVerificationPath}?token=${token}`;

  await resend.emails.send({
    from: "onboarding@resend.dev",
    to: email,
    subject: "Verify your registration request",
    html: `<p>Click <a href="${verificationEmailLink}">here</a> to verify your registeration request.</p>`,
  });
};

export const sendPasswordResetEmail = async (email: string, token: string) => {
  const passwordResetPath = authPaths.PasswordReset();
  const passwordResetLink = `${NEXT_PUBLIC_APP_URL}${passwordResetPath}?token=${token}`;

  await resend.emails.send({
    from: "onboarding@resend.dev",
    to: email,
    subject: "Verify your new password request",
    html: `<p>Click <a href="${passwordResetLink}">here</a> to verify your new password request.</p>`,
  });
};

export const sendTwoFactorTokenEmail = async (email: string, token: string) => {
  await resend.emails.send({
    from: "onboarding@resend.dev",
    to: email,
    subject: "Two factor authentication code",
    html: `<p>Your two factor authentication code is: ${token}.</p>`,
  });
};
