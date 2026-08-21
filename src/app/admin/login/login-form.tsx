"use client";

import { useActionState, useState } from "react";
import { loginAction } from "@/lib/admin-actions";
import { Eye, EyeOff } from "lucide-react";

export function LoginForm() {
  const [state, formAction, pending] = useActionState(loginAction, undefined);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label
          htmlFor="login-email"
          className="text-ink-muted mb-1 block text-xs font-bold tracking-wide uppercase"
        >
          Email
        </label>
        <input
          id="login-email"
          name="email"
          type="email"
          required
          autoComplete="username"
          placeholder="you@kyabiseug.ug"
          className="border-border bg-surface text-ink focus:border-brand w-full rounded-lg border px-3 py-2.5 text-sm outline-none"
        />
      </div>

      <div>
        <label
          htmlFor="login-password"
          className="text-ink-muted mb-1 block text-xs font-bold tracking-wide uppercase"
        >
          Password
        </label>
        <div className="relative">
          <input
            id="login-password"
            name="password"
            type={showPassword ? "text" : "password"}
            required
            autoComplete="current-password"
            className="border-border bg-surface text-ink focus:border-brand w-full rounded-lg border py-2.5 pr-11 pl-3 text-sm outline-none"
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            // aria-pressed rather than a changing label, so a screen reader
            // announces the state of one control instead of two different buttons.
            aria-pressed={showPassword}
            aria-label={showPassword ? "Hide password" : "Show password"}
            title={showPassword ? "Hide password" : "Show password"}
            // Excluded from tab order: it sits between the password field and the
            // sign-in button, and a keyboard user tabbing to submit shouldn't
            // land on a reveal toggle first.
            tabIndex={-1}
            className="text-ink-soft hover:text-brand absolute top-1/2 right-3 -translate-y-1/2 transition"
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {state?.error && <p className="text-brand text-sm">{state.error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="bg-brand font-headline hover:bg-brand-ink w-full rounded-full py-2.5 text-sm font-bold tracking-wide text-white uppercase transition disabled:opacity-60"
      >
        {pending ? "Signing in..." : "Sign In"}
      </button>
    </form>
  );
}
