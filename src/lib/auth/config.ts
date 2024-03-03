import type { NextAuthConfig } from "next-auth";

import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import Github from "next-auth/providers/github";
import bcrypt from "bcryptjs";

import { getUserByEmail } from "@/lib/db/queries/users";

import { LoginValidator } from "@/validators";

export default {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    Github({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
    Credentials({
      async authorize(credentials) {
        const validatedFields = LoginValidator.safeParse(credentials);

        if (validatedFields.success) {
          const { email, password } = validatedFields.data;

          const user = await getUserByEmail(email);

          if (!user || !user.password) return null;

          const isValidCredentials = await bcrypt.compare(
            password,
            user.password
          );

          if (isValidCredentials) return user;
        }

        return null;
      },
    }),
  ],
} satisfies NextAuthConfig;
