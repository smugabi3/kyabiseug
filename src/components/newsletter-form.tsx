"use client";

import { useState, useTransition } from "react";
import { subscribeNewsletter } from "@/lib/actions";
import { Mail } from "lucide-react";
import { cn } from "@/lib/utils";

export function NewsletterForm({ variant = "footer" }: { variant?: "footer" | "inline" }) {
  const [email, setEmail] = useState("");
  const [result, setResult] = useState<{ ok: boolean; message: string } | null>(null);
  const [pending, startTransition] = useTransition();

  return (
    <form
      id="newsletter"
      onSubmit={(e) => {
        e.preventDefault();
        startTransition(async () => {
          const res = await subscribeNewsletter(email);
          setResult(res);
          if (res.ok) setEmail("");
        });
      }}
      className={cn("w-full", variant === "footer" ? "max-w-sm" : "max-w-md")}
    >
      <div className="flex items-center gap-2 rounded-full border border-border bg-surface px-2 py-1.5">
        <Mail className="ml-1.5 h-4 w-4 shrink-0 text-ink-soft" />
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="w-full min-w-0 bg-transparent text-sm text-ink outline-none placeholder:text-ink-soft"
        />
        <button
          type="submit"
          disabled={pending}
          className="shrink-0 rounded-full bg-brand px-4 py-1.5 font-headline text-xs font-bold uppercase tracking-wide text-white transition hover:bg-brand-ink disabled:opacity-60"
        >
          {pending ? "..." : "Subscribe"}
        </button>
      </div>
      {result && (
        <p className={cn("mt-2 text-xs", result.ok ? "text-cat-sports" : "text-brand")}>
          {result.message}
        </p>
      )}
    </form>
  );
}
