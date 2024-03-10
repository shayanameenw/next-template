"use server";

import { Role } from "@prisma/client";

import { getCurrentRole } from "@/lib/auth";

export async function example() {
  const role = await getCurrentRole();

  if (role !== Role.ADMIN) {
    return { status: false, message: "Forbidden Server Action!", payload: {} };
  }

  return { status: true, message: "Allowed Server Action!", payload: {} };
}
