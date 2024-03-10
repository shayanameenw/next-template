import { Error } from "@/components/common/error";
import { ProfileExample } from "@/components/user/profile-example";
import { getCurrentUser } from "@/lib/auth";

export default async function ClientPage() {
  const user = await getCurrentUser();

  if (!user) {
    return <Error message="You do not have permission to view this content!" />;
  }

  return (
    <>
      <section className="min-h-screen flex flex-col justify-center items-center">
        <ProfileExample label="User Profile" user={user} />
      </section>
    </>
  );
}
