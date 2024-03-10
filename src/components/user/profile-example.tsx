"use client";

import type { ExtendedUser } from "@/types/next-auth";

import zod from "zod";
import { useState, useTransition } from "react";
import { Role } from "@prisma/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Error } from "@/components/common/error";
import { Success } from "@/components/common/success";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

import { UpdateProfileValidator } from "@/validators";

import { updateProfile } from "@/server/update-profile";
import { LogoutButton } from "../auth/buttons/logout-button";

interface ProfileExampleProps {
  label: string;
  user: ExtendedUser;
}

export function ProfileExample({ label, user }: Readonly<ProfileExampleProps>) {
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();

  const form = useForm<zod.infer<typeof UpdateProfileValidator>>({
    resolver: zodResolver(UpdateProfileValidator),
    defaultValues: {
      name: user?.name || undefined,
      email: user?.email || undefined,
      password: undefined,
      newPassword: undefined,
      role: user?.role,
      isTwoFactorEnabled: user?.isTwoFactorEnabled || undefined,
    },
  });

  function onSubmit(validatedFields: zod.infer<typeof UpdateProfileValidator>) {
    setError("");
    setSuccess("");

    startTransition(async () => {
      try {
        const data = await updateProfile(validatedFields);

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
    <Card>
      <CardHeader>
        <p className="text-2xl font-semibold text-center">{label}</p>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="John Doe"
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {!user?.isSocialAccount && (
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
                          {...field}
                          placeholder="********"
                          type="password"
                          disabled={isPending}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="newPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>New Password</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="********"
                          type="password"
                          disabled={isPending}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <Select
                    disabled={isPending}
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={Role.ADMIN}>{Role.ADMIN}</SelectItem>
                      <SelectItem value={Role.USER}>{Role.USER}</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            {!user?.isSocialAccount && (
              <FormField
                control={form.control}
                name="isTwoFactorEnabled"
                render={({ field }) => (
                  <FormItem className="flex flex-row gap-4 items-center justify-between rounded-lg border p-3 shadow-sm">
                    <div className="space-y-0.5">
                      <FormLabel>Two Factor Authentication</FormLabel>
                      <FormDescription>
                        Enable two factor authentication for your account
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        disabled={isPending}
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            )}
            {!isPending && error && <Error message={error} />}
            {!isPending && !error && success && <Success message={success} />}
            <div className="flex gap-4 items-center">
              <Button disabled={isPending} size="lg">
                Save
              </Button>
              <LogoutButton disabled={isPending} size="lg">
                Logout
              </LogoutButton>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
