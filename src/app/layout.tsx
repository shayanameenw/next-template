import type { Metadata } from "next";
import type { PropsWithChildren } from "react";

import { RootProvider } from "./provider";

import { Toaster } from "@/components/ui/sonner";

import { auth } from "@/lib/auth";

import "./globals.css";

export const metadata: Metadata = {
  title: "Next Template",
};

export default async function RootLayout({ children }: PropsWithChildren) {
  const session = await auth();

  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <RootProvider session={session}>
          {children}
          <Toaster />
        </RootProvider>
      </body>
    </html>
  );
}
