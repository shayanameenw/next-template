"use client";

import type { ButtonProps } from "@/components/ui/button";

import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { RegisterRequestForm } from "@/components/auth/forms/register-request-form";

import { authPaths } from "@/routes/paths";

interface LoginButtonProps extends ButtonProps {
  isModal?: boolean;
}

export function RegisterRequestButton({
  isModal,
  children,
  ...props
}: LoginButtonProps) {
  const router = useRouter();

  if (isModal) {
    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button {...props}>{children}</Button>
        </DialogTrigger>
        <DialogContent>
          <RegisterRequestForm />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Button
      onClick={() => {
        router.push(authPaths.registerRequest());
      }}
      {...props}
    >
      {children}
    </Button>
  );
}
