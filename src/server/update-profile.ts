"use server";

import bcrypt from "bcryptjs";
import zod from "zod";

import { unstable_update as update, getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { getUserById, getUserByEmail } from "@/lib/db/queries/users";
import { generateVerificationToken } from "@/lib/tokens";
import { sendVerificationEmail } from "@/lib/emails";

import { UpdateProfileValidator } from "@/validators";

export async function updateProfile(
  fields: zod.infer<typeof UpdateProfileValidator>
) {
  // If the fields are invalid, return an error
  const validatedFields = UpdateProfileValidator.safeParse(fields);

  if (!validatedFields.success) {
    return { status: false, message: "Invalid fields!", payload: {} };
  }

  // If the user does not exist, return an error
  const user = await getCurrentUser();

  if (!user) {
    return { status: false, message: "Unauthorized", payload: {} };
  }

  // If the user does not exist in db, return an error
  const dbUser = await getUserById(user.id!);

  if (!dbUser) {
    return { status: false, message: "Unauthorized", payload: {} };
  }

  // If the user is using OAuth, do not allow certain fields to be updated
  if (user.isSocialAccount) {
    validatedFields.data.email = undefined;
    validatedFields.data.password = undefined;
    validatedFields.data.newPassword = undefined;
    validatedFields.data.isTwoFactorEnabled = undefined;
  }

  // If the email is being updated, send a verification email
  if (validatedFields.data.email && validatedFields.data.email !== user.email) {
    const existingUser = await getUserByEmail(validatedFields.data.email);

    // If the email already exists, return an error
    if (existingUser && existingUser.id !== user.id) {
      return { status: false, message: "Email already in use!", payload: {} };
    }

    const verificationToken = await generateVerificationToken(
      validatedFields.data.email
    );

    await sendVerificationEmail(
      verificationToken.email,
      verificationToken.token
    );

    return { status: true, message: "Verification email sent!", payload: {} };
  }

  // If the password is being updated, hash the new password
  if (
    validatedFields.data.password &&
    validatedFields.data.newPassword &&
    dbUser.password
  ) {
    // If the password is incorrect, return an error
    const passwordsMatch = await bcrypt.compare(
      validatedFields.data.password,
      dbUser.password
    );

    if (!passwordsMatch) {
      return { status: false, message: "Incorrect password!", payload: {} };
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(
      validatedFields.data.newPassword,
      10
    );

    // Update the password
    validatedFields.data.password = hashedPassword;
    validatedFields.data.newPassword = undefined;
  }

  // Update the user profile in db
  const updatedUser = await db.user.update({
    where: { id: dbUser.id },
    data: {
      ...validatedFields.data,
    },
  });

  // Update the user profile in the session
  update({
    user: {
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      isTwoFactorEnabled: updatedUser.isTwoFactorEnabled,
    },
  });

  return { status: true, message: "Profile Updated!", payload: {} };
}
