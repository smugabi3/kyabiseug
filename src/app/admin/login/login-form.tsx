"use client";

import { useActionState } from "react";
import { loginAction } from "@/lib/admin-actions";

export function LoginForm() {
  const [state, formAction, pending] = useActionState(loginAction, undefined);

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-ink-muted">
          Email
        </label>
        <input
          name="email"
          type="email"
          required
          placeholder="you@kyabiseug.ug"
          className="w-full rounded-lg border border-border bg-surface px-3 py-2.5 text-sm text-ink outline-none focus:border-brand"
        />
      </div>
      <div>
        <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-ink-muted">
          Password
        </label>
        <input
          name="password"
          type="password"
          required
          className="w-full rounded-lg border border-border bg-surface px-3 py-2.5 text-sm text-ink outline-none focus:border-brand"
        />
      </div>
      {state?.error && <p className="text-sm text-brand">{state.error}</p>}
      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-full bg-brand py-2.5 font-headline text-sm font-bold uppercase tracking-wide text-white transition hover:bg-brand-ink disabled:opacity-60"
      >
        {pending ? "Signing in..." : "Sign In"}
      </button>
    </form>
  );
}
