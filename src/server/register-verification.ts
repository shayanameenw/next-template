"use server";

import { db } from "@/lib/db";
import { getUserByEmail } from "@/lib/db/queries/users";
import { getVerificationTokenByToken } from "@/lib/db/queries/verificiation-tokens";

export async function registerVerification(token: string) {
  const existingToken = await getVerificationTokenByToken(token);

  // If the token does not exist, return an error
  if (!existingToken) {
    return { status: false, message: "Token does not exist!", payload: {} };
  }

  // If the token has expired, return an error
  const hasExpired = new Date(existingToken.expires) < new Date();

  if (hasExpired) {
    return { status: false, message: "Token has expired!", payload: {} };
  }

  // If the user does not exist, return an error
  const existingUser = await getUserByEmail(existingToken.email);

  if (!existingUser) {
    return { status: false, message: "Email does not exist!", payload: {} };
  }

  // Update the user's email and emailVerified
  await db.user.update({
    where: { id: existingUser.id },
    data: {
      email: existingToken.email,
      emailVerified: new Date(),
    },
  });

  // Delete the verification token
  await db.verificationToken.delete({
    where: { id: existingToken.id },
  });

  return { status: true, message: "Email verified", payload: {}! };
}
