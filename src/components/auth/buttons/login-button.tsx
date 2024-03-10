"use client";

import type { ButtonProps } from "@/components/ui/button";

import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { LoginForm } from "@/components/auth/forms/login-form";

import { authPaths } from "@/routes/paths";

interface LoginButtonProps extends ButtonProps {
  isModal?: boolean;
}

export function LoginButton({ isModal, children, ...props }: LoginButtonProps) {
  const router = useRouter();

  if (isModal) {
    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button {...props}>{children}</Button>
        </DialogTrigger>
        <DialogContent>
          <LoginForm />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Button
      onClick={() => {
        router.push(authPaths.login());
      }}
      {...props}
    >
      {children}
    </Button>
  );
}
