"use server";

import bcrypt from "bcryptjs";
import zod from "zod";

import { db } from "@/lib/db";
import { getUserByEmail } from "@/lib/db/queries/users";
import { sendVerificationEmail } from "@/lib/emails";
import { generateVerificationToken } from "@/lib/tokens";

import { RegisterRequestValidator } from "@/validators";

export async function registerRequest(
  fields: zod.infer<typeof RegisterRequestValidator>
) {
  const validatedFields = RegisterRequestValidator.safeParse(fields);

  // If the fields are invalid, return an error
  if (!validatedFields.success) {
    return { status: false, message: "Invalid fields!", payload: {} };
  }

  const { email, password, name } = validatedFields.data;

  // If the user already exists, return an error
  const existingUser = await getUserByEmail(email);

  if (existingUser) {
    return { status: false, message: "Email already in use!", payload: {} };
  }

  // Hash the password and create the user
  const hashedPassword = await bcrypt.hash(password, 10);

  await db.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });

  // Generate a verification token and send a verification email
  const verificationToken = await generateVerificationToken(email);

  await sendVerificationEmail(verificationToken.email, verificationToken.token);

  return { status: true, message: "Verification email sent!", payload: {} };
}
