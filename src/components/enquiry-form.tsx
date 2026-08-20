"use client";

import { useActionState } from "react";
import { CheckCircle2 } from "lucide-react";
import type { EnquiryState } from "@/lib/enquiry-actions";

type Action = (prev: EnquiryState | undefined, formData: FormData) => Promise<EnquiryState>;

export function EnquiryForm({
  action,
  submitLabel,
  successTitle,
  successBody,
  children,
}: {
  action: Action;
  submitLabel: string;
  successTitle: string;
  successBody: string;
  children: React.ReactNode;
}) {
  const [state, formAction, pending] = useActionState(action, undefined);

  if (state?.ok) {
    return (
      <div className="border-border bg-surface-alt rounded-xl border p-8 text-center">
        <CheckCircle2 className="text-cat-sports mx-auto h-9 w-9" />
        <h2 className="font-headline text-ink mt-3 text-lg font-bold">{successTitle}</h2>
        <p className="text-ink-muted mx-auto mt-2 max-w-md text-sm leading-relaxed">
          {successBody}
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-5">
      {children}

      {/* Honeypot: hidden from people, irresistible to bots. Not `display:none`,
          which some bots skip — off-screen text still gets auto-filled. */}
      <div aria-hidden="true" className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
        <label>
          Website
          <input name="website" type="text" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      {state?.error && <p className="text-brand text-sm">{state.error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="bg-brand font-headline hover:bg-brand-ink rounded-full px-6 py-3 text-sm font-bold tracking-wide text-white uppercase transition disabled:opacity-60"
      >
        {pending ? "Sending..." : submitLabel}
      </button>
    </form>
  );
}

export function Field({
  label,
  name,
  type = "text",
  required,
  placeholder,
  hint,
  autoComplete,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
  hint?: string;
  autoComplete?: string;
}) {
  return (
    <label className="block">
      <span className="text-ink-muted mb-1 block text-xs font-bold tracking-wide uppercase">
        {label}
        {!required && <span className="text-ink-soft normal-case"> (optional)</span>}
      </span>
      <input
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className="input"
      />
      {hint && <span className="text-ink-soft mt-1 block text-xs">{hint}</span>}
    </label>
  );
}

export function TextArea({
  label,
  name,
  rows = 6,
  required,
  placeholder,
}: {
  label: string;
  name: string;
  rows?: number;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="text-ink-muted mb-1 block text-xs font-bold tracking-wide uppercase">
        {label}
      </span>
      <textarea
        name={name}
        rows={rows}
        required={required}
        placeholder={placeholder}
        className="input"
      />
    </label>
  );
}

export function Select({
  label,
  name,
  options,
}: {
  label: string;
  name: string;
  options: { value: string; label: string }[];
}) {
  return (
    <label className="block">
      <span className="text-ink-muted mb-1 block text-xs font-bold tracking-wide uppercase">
        {label}
      </span>
      <select name={name} className="input" defaultValue={options[0]?.value}>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}
