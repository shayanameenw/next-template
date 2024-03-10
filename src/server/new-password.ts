"use server";

import bcrypt from "bcryptjs";
import zod from "zod";

import { db } from "@/lib/db";
import { getPasswordResetTokenByToken } from "@/lib/db/queries/password-reset-tokens";
import { getUserByEmail } from "@/lib/db/queries/users";

import { PasswordResetValidator } from "@/validators";

export async function newPassword(
  fields: zod.infer<typeof PasswordResetValidator>,
  token: string
) {
  const validatedFields = PasswordResetValidator.safeParse(fields);

  // If the fields are invalid, return an error
  if (!validatedFields.success) {
    return { status: false, message: "Invalid fields!", data: {} };
  }

  const { password } = validatedFields.data;

  // If the token does not exist, return an error
  const existingToken = await getPasswordResetTokenByToken(token);

  if (!existingToken) {
    return { status: false, message: "Invalid token!", data: {} };
  }

  // If the token has expired, return an error
  const hasExpired = new Date(existingToken.expires) < new Date();

  if (hasExpired) {
    return { status: false, message: "Token has expired!", data: {} };
  }

  // If the user does not exist, return an error
  const existingUser = await getUserByEmail(existingToken.email);

  if (!existingUser) {
    return { status: false, message: "Email does not exist!", data: {} };
  }

  // Hash the new password and update the user's password
  const hashedPassword = await bcrypt.hash(password, 10);

  await db.user.update({
    where: { id: existingUser.id },
    data: { password: hashedPassword },
  });

  // Delete the password reset token
  await db.passwordResetToken.delete({
    where: { id: existingToken.id },
  });

  return { status: true, message: "Password updated!", data: {} };
}
