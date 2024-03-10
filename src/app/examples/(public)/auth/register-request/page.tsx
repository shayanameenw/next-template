import { RegisterRequestForm } from "@/components/auth/forms/register-request-form";

export default function RegisterPage() {
  return (
    <>
      <section className="min-h-screen flex flex-col justify-center items-center">
        <RegisterRequestForm />
      </section>
    </>
  );
}
