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
      <div className="border-border bg-surface flex items-center gap-2 rounded-full border px-2 py-1.5">
        <Mail className="text-ink-soft ml-1.5 h-4 w-4 shrink-0" />
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="text-ink placeholder:text-ink-soft w-full min-w-0 bg-transparent text-sm outline-none"
        />
        <button
          type="submit"
          disabled={pending}
          className="bg-brand font-headline hover:bg-brand-ink shrink-0 rounded-full px-4 py-1.5 text-xs font-bold tracking-wide text-white uppercase transition disabled:opacity-60"
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
