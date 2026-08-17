"use client";

import { useActionState } from "react";
import { loginAction } from "@/lib/admin-actions";

export function LoginForm() {
  const [state, formAction, pending] = useActionState(loginAction, undefined);

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label className="text-ink-muted mb-1 block text-xs font-bold tracking-wide uppercase">
          Email
        </label>
        <input
          name="email"
          type="email"
          required
          placeholder="you@kyabiseug.ug"
          className="border-border bg-surface text-ink focus:border-brand w-full rounded-lg border px-3 py-2.5 text-sm outline-none"
        />
      </div>
      <div>
        <label className="text-ink-muted mb-1 block text-xs font-bold tracking-wide uppercase">
          Password
        </label>
        <input
          name="password"
          type="password"
          required
          className="border-border bg-surface text-ink focus:border-brand w-full rounded-lg border px-3 py-2.5 text-sm outline-none"
        />
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
