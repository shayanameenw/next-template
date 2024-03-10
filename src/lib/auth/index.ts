import type { Role } from "@prisma/client";

import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";

import authConfig from "@/lib/auth/config";
import { db } from "@/lib/db";
import { getAccountByUserId } from "@/lib/db/queries/accounts";
import { getTwoFactorConfirmationByUserId } from "@/lib/db/queries/two-factor-confirmations";
import { getUserById } from "@/lib/db/queries/users";

import { authPaths } from "@/routes/paths";

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
  unstable_update,
} = NextAuth({
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  pages: {
    signIn: authPaths.login(),
    error: authPaths.error(),
  },
  callbacks: {
    async jwt({ token }) {
      if (!token.sub) return token;

      const existingUser = await getUserById(token.sub);

      if (!existingUser) return token;
      token.name = existingUser.name;
      token.email = existingUser.email;
      token.isTwoFactorEnabled = existingUser.isTwoFactorEnabled;
      token.role = existingUser.role;

      const existingAccount = await getAccountByUserId(existingUser.id);
      token.isSocialAccount = !!existingAccount;

      return token;
    },
    async session({ token, session }) {
      session.user.id = token.sub as string;
      session.user.name = token.name as string;
      session.user.email = token.email as string;
      session.user.isTwoFactorEnabled = token.isTwoFactorEnabled as boolean;
      session.user.role = token.role as Role;
      session.user.isSocialAccount = token.isSocialAccount as boolean;

      return session;
    },
    async signIn({ user, account }) {
      // Allow OAuth Sign In without Email Verification
      if (account?.provider !== "credentials") return true;

      const dbUser = await getUserById(user.id!);

      // Prevent Sign In without Email Verification
      if (!dbUser?.emailVerified) return false;

      // Check 2FA is enabled
      if (dbUser.isTwoFactorEnabled) {
        const twoFactorConfirmation = await getTwoFactorConfirmationByUserId(
          dbUser.id
        );

        // Prevent Sign In without 2FA Confirmation
        if (!twoFactorConfirmation) return false;

        // Delete 2FA Confirmation for next Sign In
        await db.twoFactorConfirmation.delete({
          where: { id: twoFactorConfirmation.id },
        });
      }

      return true;
    },
  },
  events: {
    async linkAccount({ user }) {
      await db.user.update({
        where: { id: user.id },
        data: { emailVerified: new Date() },
      });
    },
  },

  ...authConfig,
});

export const getCurrentUser = async () => {
  const session = await auth();

  return session?.user;
};

export const getCurrentRole = async () => {
  const session = await auth();

  return session?.user?.role;
};
