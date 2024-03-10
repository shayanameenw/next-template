import type { User } from "next-auth";

import { Role } from "@prisma/client";

type ExtendedUser = User & {
  role: Role;
  isTwoFactorEnabled: boolean;
  isSocialAccount: boolean;
};

declare module "next-auth" {
  interface Session {
    user: ExtendedUser;
  }
}
