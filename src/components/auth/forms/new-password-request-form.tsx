"use client";

import zod from "zod";
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

import { PasswordResetRequestValidator } from "@/validators";

import { newPasswordRequest } from "@/server/new-password-request";
import { Error } from "@/components/common/error";
import { Success } from "@/components/common/success";

export function NewPasswordRequestForm() {
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();

  const form = useForm<zod.infer<typeof PasswordResetRequestValidator>>({
    resolver: zodResolver(PasswordResetRequestValidator),
    defaultValues: {
      email: "",
    },
  });

  function onSubmit(
    validatedFields: zod.infer<typeof PasswordResetRequestValidator>
  ) {
    setError("");
    setSuccess("");

    startTransition(async () => {
      try {
        const data = await newPasswordRequest(validatedFields);

        if (!data?.status) {
          form.reset();
          setError(data?.message);
        }

        if (data?.status) {
          form.reset();
          setSuccess(data?.message);
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
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  placeholder="me@example.com"
                  {...field}
                  disabled={isPending}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {!isPending && error && <Error message={error} />}
        {!isPending && !error && success && <Success message={success} />}
        <Button disabled={isPending} size="lg">
          Reset Password
        </Button>
      </form>
    </Form>
  );
}
