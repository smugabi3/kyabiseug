import { Logo } from "@/components/logo";
import { LoginForm } from "./login-form";

export default function AdminLoginPage() {
  return (
    <div className="bg-surface-alt flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-16">
      <div className="border-border bg-surface w-full max-w-sm rounded-xl border p-8 shadow-sm">
        <div className="mb-6 flex flex-col items-center text-center">
          <Logo />
          <p className="font-headline text-ink-muted mt-2 text-sm font-bold tracking-wide uppercase">
            Staff Login
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
