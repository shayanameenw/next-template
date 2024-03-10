"use client";

import Link from "next/link";
import zod from "zod";
import { useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Error } from "@/components/common/error";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Success } from "@/components/common/success";

import { LoginValidator } from "@/validators";

import { login } from "@/server/login";

import { authPaths } from "@/routes/paths";

export function LoginForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");
  const differentProviderError =
    searchParams.get("error") === "OAuthAccountNotLinked"
      ? "Email already in use with different provider!"
      : "";

  const [inputTwoFactorCode, setInputTwoFactorCode] = useState<boolean>(false);
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();

  const form = useForm<zod.infer<typeof LoginValidator>>({
    resolver: zodResolver(LoginValidator),
    defaultValues: {
      email: "",
      password: "",
      code: "",
    },
  });

  function onSubmit(validatedFields: zod.infer<typeof LoginValidator>) {
    setError("");
    setSuccess("");

    startTransition(async () => {
      try {
        const data = await login(validatedFields, callbackUrl);

        if (!data?.status) {
          form.reset();
          setError(data?.message);
        }

        if (data?.status) {
          if (data?.message === "Two Factor Authentication token email sent!") {
            setInputTwoFactorCode(true);
          } else {
            form.reset();
            setSuccess(data?.message);
          }
        }
      } catch (error) {
        setError("Something went wrong!");
      }
    });
  }

  return (
    <Form {...form}>
      <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
        {!inputTwoFactorCode && (
          <>
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
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="********"
                      {...field}
                      disabled={isPending}
                    />
                  </FormControl>
                  <Link
                    className="text-xs"
                    href={authPaths.PasswordResetRequest()}
                  >
                    Forgot Password
                  </Link>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}
        {inputTwoFactorCode && (
          <>
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Code</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="******"
                      {...field}
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}
        {!isPending && (error || differentProviderError) && (
          <Error message={error || differentProviderError} />
        )}
        {!isPending && !error && !differentProviderError && success && (
          <Success message={success} />
        )}
        <Button disabled={isPending} size="lg">
          {inputTwoFactorCode ? "Confirm" : "Login"}
        </Button>
      </form>
    </Form>
  );
}
