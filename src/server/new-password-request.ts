"use server";

import zod from "zod";

import { getUserByEmail } from "@/lib/db/queries/users";
import { sendPasswordResetEmail } from "@/lib/emails";
import { generatePasswordResetToken } from "@/lib/tokens";

import { PasswordResetRequestValidator } from "@/validators";

export async function newPasswordRequest(
  flields: zod.infer<typeof PasswordResetRequestValidator>
) {
  const validatedFields = PasswordResetRequestValidator.safeParse(flields);

  // If the fields are invalid, return an error
  if (!validatedFields.success) {
    return { status: false, message: "Invalid emaiL!", payload: {} };
  }

  const { email } = validatedFields.data;

  // If the user does not exist, return an error
  const existingUser = await getUserByEmail(email);

  if (!existingUser) {
    return { status: false, message: "Email not found!", payload: {} };
  }

  // Generate a password reset token and send a password reset email
  const passwordResetToken = await generatePasswordResetToken(email);

  await sendPasswordResetEmail(
    passwordResetToken.email,
    passwordResetToken.token
  );

  return { status: true, message: "Reset email sent!", payload: {} };
}
