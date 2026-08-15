import { Logo } from "@/components/logo";
import { LoginForm } from "./login-form";

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-surface-alt px-4 py-16">
      <div className="w-full max-w-sm rounded-xl border border-border bg-surface p-8 shadow-sm">
        <div className="mb-6 flex flex-col items-center text-center">
          <Logo />
          <p className="mt-2 font-headline text-sm font-bold uppercase tracking-wide text-ink-muted">
            Staff Login
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
