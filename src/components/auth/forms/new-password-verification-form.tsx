"use client";

import zod from "zod";
import { useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { PasswordResetValidator } from "@/validators";

import { newPassword } from "@/server/new-password";
import { Error } from "@/components/common/error";
import { Success } from "@/components/common/success";

export function NewPasswordVerificationForm() {
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();

  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const form = useForm<zod.infer<typeof PasswordResetValidator>>({
    resolver: zodResolver(PasswordResetValidator),
    defaultValues: {
      password: "",
    },
  });

  function onSubmit(validatedFields: zod.infer<typeof PasswordResetValidator>) {
    setError("");
    setSuccess("");

    startTransition(async () => {
      try {
        if (token) {
          const data = await newPassword(validatedFields, token);

          if (!data?.status) {
            form.reset();
            setError(data?.message);
          }

          if (data?.status) {
            form.reset();
            setSuccess(data?.message);
          }
        } else {
          setError("Missing token!");
        }
      } catch (error) {
        setError("Something went wrong!");
      }
    });
  }

  return (
    <Form {...form}>
      <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input placeholder="********" {...field} disabled={isPending} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {!isPending && error && <Error message={error} />}
        {!isPending && !error && success && <Success message={success} />}
        <Button disabled={isPending} size="lg">
          Confirm
        </Button>
      </form>
    </Form>
  );
}
