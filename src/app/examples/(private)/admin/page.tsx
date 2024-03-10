"use client";

import { Role } from "@prisma/client";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CardHeader } from "@/components/ui/card";
import { RoleGate } from "@/components/user/role-gate";
import { Success } from "@/components/common/success";

import { example } from "@/server/example";

export default function AdminPage() {
  async function onServerActionClick() {
    const { status, message } = await example();

    if (status) {
      toast.success(message);
    } else {
      toast.error(message);
    }
  }

  async function onApiRouteClick() {
    const response = await fetch("/api/example");

    const { message } = await response.json();

    if (response.ok) {
      toast.success(message);
    } else {
      toast.error(message);
    }
  }

  return (
    <>
      <section className="min-h-screen flex flex-col justify-center items-center">
        <Card>
          <CardHeader>
            <p className="text-2xl font-semibold text-center">
              Admin Only Actions
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <RoleGate allowedRoles={[Role.ADMIN]}>
              <Success message="You are allowed to see this content!" />
            </RoleGate>
            <div className="flex flex-row gap-4 items-center justify-between rounded-lg border p-3 shadow-md">
              <p className="text-sm font-medium">Admin Only API Route</p>
              <Button onClick={onApiRouteClick}>Click to test</Button>
            </div>
            <div className="flex flex-row gap-4 items-center justify-between rounded-lg border p-3 shadow-md">
              <p className="text-sm font-medium">Admin Only Server Action</p>
              <Button onClick={onServerActionClick}>Click to test</Button>
            </div>
          </CardContent>
        </Card>
      </section>
    </>
  );
}
