"use client";

import type { PropsWithChildren } from "react";

import { ThemeProvider } from "next-themes";

export function Provider({ children }: Readonly<PropsWithChildren>) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </ThemeProvider>
  );
}
