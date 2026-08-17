"use client";

import { useActionState } from "react";
import { ROLES, ROLE_DESCRIPTIONS, ROLE_LABELS } from "@/lib/roles";

type Action = (
  prevState: { error?: string } | undefined,
  formData: FormData
) => Promise<{ error?: string }>;

export function UserForm({
  action,
  defaults,
  submitLabel,
  lockRole,
}: {
  action: Action;
  defaults?: { name?: string; email?: string; role?: string };
  submitLabel: string;
  /** True when editing your own account — role select is disabled to prevent self-lockout. */
  lockRole?: boolean;
}) {
  const [state, formAction, pending] = useActionState(action, undefined);

  return (
    <form action={formAction} className="space-y-5">
      <Field label="Full Name">
        <input
          name="name"
          required
          defaultValue={defaults?.name}
          className="input"
          placeholder="Jane Doe"
        />
      </Field>

      <Field label="Email">
        <input
          name="email"
          type="email"
          required
          defaultValue={defaults?.email}
          className="input"
          placeholder="jane@kyabiseug.ug"
        />
      </Field>

      <Field
        label={defaults ? "New Password" : "Password"}
        hint={defaults ? "Leave blank to keep the current password." : "At least 8 characters."}
      >
        <input
          name="password"
          type="password"
          required={!defaults}
          minLength={8}
          className="input"
        />
      </Field>

      <div>
        <span className="text-ink-muted mb-2 block text-xs font-bold tracking-wide uppercase">
          Role
        </span>
        <div className="grid gap-2 sm:grid-cols-2">
          {ROLES.map((role) => (
            <label
              key={role}
              className="border-border has-[:checked]:border-brand has-[:checked]:bg-brand-tint flex cursor-pointer items-start gap-2.5 rounded-lg border p-3"
            >
              <input
                type="radio"
                name="role"
                value={role}
                required
                disabled={lockRole}
                defaultChecked={defaults?.role ? defaults.role === role : role === "subscriber"}
                className="accent-brand mt-1"
              />
              <span>
                <span className="text-ink block text-sm font-bold">{ROLE_LABELS[role]}</span>
                <span className="text-ink-muted block text-xs">{ROLE_DESCRIPTIONS[role]}</span>
              </span>
            </label>
          ))}
        </div>
        {lockRole && (
          <p className="text-ink-soft mt-2 text-xs">
            You can&apos;t change your own role. Ask another admin if this needs to change.
          </p>
        )}
      </div>

      {state?.error && <p className="text-brand text-sm">{state.error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="bg-brand font-headline hover:bg-brand-ink rounded-full px-6 py-3 text-sm font-bold tracking-wide text-white uppercase transition disabled:opacity-60"
      >
        {pending ? "Saving..." : submitLabel}
      </button>
    </form>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-ink-muted mb-1 block text-xs font-bold tracking-wide uppercase">
        {label}
      </span>
      {children}
      {hint && <span className="text-ink-soft mt-1 block text-xs">{hint}</span>}
    </label>
  );
}
