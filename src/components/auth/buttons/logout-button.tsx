"use client";

import type { ButtonProps } from "@/components/ui/button";

import { signOut } from "next-auth/react";

import { Button } from "@/components/ui/button";

export function LogoutButton({ children, ...props }: ButtonProps) {
  return (
    <Button
      onClick={() => {
        signOut();
      }}
      {...props}
    >
      {children}
    </Button>
  );
}
