"use server";

import zod from "zod";
import { AuthError } from "next-auth";

import { signIn } from "@/lib/auth";
import { db } from "@/lib/db";
import { getTwoFactorConfirmationByUserId } from "@/lib/db/queries/two-factor-confirmations";
import { getTwoFactorTokenByEmail } from "@/lib/db/queries/two-factor-tokens";
import { getUserByEmail } from "@/lib/db/queries/users";
import {
  generateVerificationToken,
  generateTwoFactorToken,
} from "@/lib/tokens";
import { sendVerificationEmail, sendTwoFactorTokenEmail } from "@/lib/emails";

import { LoginValidator } from "@/validators";

import { DEFAULT_LOGIN_REDIRECT } from "@/routes/config";

export async function login(
  fields: zod.infer<typeof LoginValidator>,
  callbackUrl: string | null
) {
  const validatedFields = LoginValidator.safeParse(fields);

  // If the fields are invalid, return an error
  if (!validatedFields.success) {
    return { status: false, message: "Invalid fields!", payload: {} };
  }

  const { email, password, code } = validatedFields.data;

  // If the user does not exist, return an error
  const existingUser = await getUserByEmail(email);

  if (!existingUser || !existingUser.email || !existingUser.password) {
    return { status: false, message: "Email does not exist!", payload: {} };
  }

  // If the user's email is not verified, send a verification email
  if (!existingUser.emailVerified) {
    const verificationToken = await generateVerificationToken(
      existingUser.email
    );

    await sendVerificationEmail(
      verificationToken.email,
      verificationToken.token
    );

    return {
      status: true,
      message: "Verification email sent!",
      payload: {},
    };
  }

  // Check 2FA enabled
  if (existingUser.isTwoFactorEnabled && existingUser.email) {
    if (code) {
      const twoFactorToken = await getTwoFactorTokenByEmail(existingUser.email);

      // If the token does not exist, return an error
      if (!twoFactorToken) {
        return { status: false, message: "Invalid code!", payload: {} };
      }

      // If the token does not match the code, return an error
      if (twoFactorToken.token !== code) {
        return { status: false, message: "Invalid code!", payload: {} };
      }

      // If the token has expired, return an error
      const hasExpired = new Date(twoFactorToken.expires) < new Date();

      if (hasExpired) {
        return { status: false, message: "Code expired!", payload: {} };
      }

      // If the user has an existing confirmation, delete it
      const existingConfirmation = await getTwoFactorConfirmationByUserId(
        existingUser.id
      );

      if (existingConfirmation) {
        await db.twoFactorConfirmation.delete({
          where: { id: existingConfirmation.id },
        });
      }

      // Delete the token and create a confirmation
      await db.twoFactorToken.delete({
        where: { id: twoFactorToken.id },
      });

      await db.twoFactorConfirmation.create({
        data: {
          userId: existingUser.id,
        },
      });
    } else {
      // If the code is not provided, send a 2FA token
      const twoFactorToken = await generateTwoFactorToken(existingUser.email);

      await sendTwoFactorTokenEmail(twoFactorToken.email, twoFactorToken.token);

      return {
        status: true,
        message: "Two Factor Authentication token email sent!",
        payload: {},
      };
    }
  }

  try {
    // Sign in the user
    await signIn("credentials", {
      email,
      password,
      redirectTo: callbackUrl || DEFAULT_LOGIN_REDIRECT,
    });
  } catch (error) {
    // If the error is an AuthError, handle it
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return {
            status: false,
            message: "Invalid credentials!",
            payload: {},
          };
        default:
          return {
            status: false,
            message: "Something went wrong!",
            payload: {},
          };
      }
    }

    throw error;
  }
}
