"use server";

import { getCurrentRole } from "@/lib/auth";
import { Role } from "@prisma/client";

export const admin = async () => {
  const role = await getCurrentRole();

  if (role === Role.ADMIN) {
    return { success: "Allowed Server Action!" };
  }

  return { error: "Forbidden Server Action!" };
};
