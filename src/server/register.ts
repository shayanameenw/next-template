"use server";

import * as zod from "zod";
import bcrypt from "bcryptjs";

import { db } from "@/lib/db";
import { RegisterValidator } from "@/validators";
import { getUserByEmail } from "@/lib/db/queries/users";
import { sendVerificationEmail } from "@/lib/emails";
import { generateVerificationToken } from "@/lib/tokens";

export const register = async (values: zod.infer<typeof RegisterValidator>) => {
  const validatedFields = RegisterValidator.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { email, password, name } = validatedFields.data;
  const hashedPassword = await bcrypt.hash(password, 10);

  const existingUser = await getUserByEmail(email);

  if (existingUser) {
    return { error: "Email already in use!" };
  }

  await db.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });

  const verificationToken = await generateVerificationToken(email);
  await sendVerificationEmail(verificationToken.email, verificationToken.token);

  return { success: "Confirmation email sent!" };
};
