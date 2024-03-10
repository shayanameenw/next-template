"use client";

import { useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";

import { registerVerification } from "@/server/register-verification";
import { Error } from "@/components/common/error";
import { Success } from "@/components/common/success";

export function RegisterVerificationForm() {
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();

  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const form = useForm();

  function onSubmit() {
    startTransition(async () => {
      try {
        if (token) {
          const data = await registerVerification(token);

          if (!data.status) {
            setError(data.message);
          }

          if (data.status) {
            setSuccess(data.message);
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
        {!isPending && error && <Error message={error} />}
        {!isPending && !error && success && <Success message={success} />}
        <Button disabled={isPending} size="lg">
          Verify
        </Button>
      </form>
    </Form>
  );
}
