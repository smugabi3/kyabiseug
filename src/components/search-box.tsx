"use client";

import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { useState } from "react";

export function SearchBox({ className, autoFocus }: { className?: string; autoFocus?: boolean }) {
  const router = useRouter();
  const [q, setQ] = useState("");

  return (
    <form
      className={className}
      onSubmit={(e) => {
        e.preventDefault();
        if (q.trim()) router.push(`/search?q=${encodeURIComponent(q.trim())}`);
      }}
    >
      <div className="border-border bg-surface-alt focus-within:border-brand flex items-center gap-2 rounded-full border px-3 py-1.5">
        <Search className="text-ink-soft h-4 w-4 shrink-0" />
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search KyabiseUG..."
          autoFocus={autoFocus}
          className="text-ink placeholder:text-ink-soft w-full bg-transparent text-sm outline-none"
        />
      </div>
    </form>
  );
}
