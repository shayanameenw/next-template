"use client";

import type { PropsWithChildren } from "react";

import { ThemeProvider } from "next-themes";
import { SessionProvider } from "next-auth/react";
import { Session } from "next-auth";

interface RootProviderProps {
  session: Session | null;
}

export function RootProvider({
  session,
  children,
}: Readonly<PropsWithChildren<RootProviderProps>>) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <SessionProvider session={session}>{children}</SessionProvider>
    </ThemeProvider>
  );
}
