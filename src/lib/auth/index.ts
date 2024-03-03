import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";

import authConfig from "@/lib/auth/config";
import { db } from "@/lib/db";
import { getAccountByUserId } from "@/lib/db/queries/accounts";
import { getTwoFactorConfirmationByUserId } from "@/lib/db/queries/two-factor-confirmations";
import { getUserById } from "@/lib/db/queries/users";

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
    signIn: "/auth/login",
    error: "/auth/error",
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
      token.isOAuth = !!existingAccount;

      return token;
    },
    async session({ token, session }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }

      if (token.name && session.user) {
        session.user.name = token.name;
      }

      if (token.email && session.user) {
        session.user.email = token.email;
      }

      if (token.isTwoFactorEnabled && session.user) {
        session.user.isTwoFactorEnabled = token.isTwoFactorEnabled;
      }

      if (token.role && session.user) {
        session.user.role = token.role;
      }

      if (token.isOAuth && session.user) {
        session.user.isOAuth = token.isOAuth;
      }

      return session;
    },
    async signIn({ user, account }) {
      // Allow OAuth Sign In without Email Verification
      if (account?.provider !== "credentials") return true;

      const dbUser = await getUserById(user.id!);

      // Prevent Sign In without Email Verification
      if (!dbUser?.emailVerified) return false;

      // Check if 2FA is enabled
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
