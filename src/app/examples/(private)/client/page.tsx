"use client";

import { Error } from "@/components/common/error";
import { UserInfoExample } from "@/components/user/user-info-example";

import { useCurrentUser } from "@/hooks/use-current-user";

export default function ClientPage() {
  const user = useCurrentUser();

  if (!user) {
    return <Error message="You do not have permission to view this content!" />;
  }

  return (
    <>
      <section className="min-h-screen flex flex-col justify-center items-center">
        <UserInfoExample label="User Info on Client Component" user={user} />
      </section>
    </>
  );
}
