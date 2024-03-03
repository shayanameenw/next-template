"use server";

import * as zod from "zod";

import { ResetValidator } from "@/validators";
import { getUserByEmail } from "@/lib/db/queries/users";
import { sendPasswordResetEmail } from "@/lib/emails";
import { generatePasswordResetToken } from "@/lib/tokens";

export const reset = async (values: zod.infer<typeof ResetValidator>) => {
  const validatedFields = ResetValidator.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid emaiL!" };
  }

  const { email } = validatedFields.data;

  const existingUser = await getUserByEmail(email);

  if (!existingUser) {
    return { error: "Email not found!" };
  }

  const passwordResetToken = await generatePasswordResetToken(email);
  await sendPasswordResetEmail(
    passwordResetToken.email,
    passwordResetToken.token
  );

  return { success: "Reset email sent!" };
};
