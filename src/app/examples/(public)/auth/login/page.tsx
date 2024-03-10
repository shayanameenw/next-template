import { LoginForm } from "@/components/auth/forms/login-form";

export default function LoginPage() {
  return (
    <>
      <section className="min-h-screen flex flex-col justify-center items-center">
        <LoginForm />
      </section>
    </>
  );
}
