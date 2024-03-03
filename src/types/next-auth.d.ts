import type { Session } from "next-auth";

import { Role } from "@prisma/client";

type ExtendedUser = Session["user"] & {
  role: Role;
  isOAuth: boolean;
  isTwoFactorEnabled: boolean;
};

declare module "next-auth" {
  interface Session {
    user: ExtendedUser;
  }
}
