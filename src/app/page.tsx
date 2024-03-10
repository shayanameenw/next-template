import { ThemeMenu } from "@/components/theme/theme-menu";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { LoginButton } from "@/components/auth/buttons/login-button";
import { RegisterRequestButton } from "@/components/auth/buttons/register-request-button";
import { LogoutButton } from "@/components/auth/buttons/logout-button";

export default function HomePage() {
  return (
    <main>
      <section className="min-h-screen flex gap-4 justify-center items-center">
        <ThemeMenu />
        <LoginButton size="lg">Login</LoginButton>
        <RegisterRequestButton size="lg">Register</RegisterRequestButton>
        <LogoutButton size="lg">Logout</LogoutButton>
        <ThemeToggle />
      </section>
    </main>
  );
}
