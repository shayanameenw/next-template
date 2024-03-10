"use client";

import { PropsWithChildren } from "react";
import { Role } from "@prisma/client";

import { Error } from "@/components/common/error";

import { useCurrentRole } from "@/hooks/use-current-role";

interface RoleGateProps {
  allowedRoles: Role[];
}

export const RoleGate = ({
  children,
  allowedRoles,
}: Readonly<PropsWithChildren<RoleGateProps>>) => {
  const role = useCurrentRole();

  if (!allowedRoles.includes(role)) {
    return <Error message="You do not have permission to view this content!" />;
  }

  return <>{children}</>;
};
