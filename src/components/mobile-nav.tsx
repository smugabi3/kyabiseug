"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { SearchBox } from "@/components/search-box";
import { useMounted } from "@/lib/use-mounted";

export function MobileNav({
  categories,
}: {
  categories: { slug: string; name: string }[];
}) {
  const [open, setOpen] = useState(false);
  const mounted = useMounted();

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        aria-label="Open menu"
        onClick={() => setOpen(true)}
        className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-ink"
      >
        <Menu className="h-4 w-4" />
      </button>

      {mounted &&
        open &&
        createPortal(
          <div className="fixed inset-0 z-50 overflow-y-auto bg-surface">
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <span className="font-headline text-lg font-extrabold">Menu</span>
              <button
                type="button"
                aria-label="Close menu"
                onClick={() => setOpen(false)}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-ink"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="flex flex-col gap-6 p-5">
              <SearchBox />
              <nav className="flex flex-col divide-y divide-border">
                <Link
                  href="/"
                  onClick={() => setOpen(false)}
                  className="py-3 font-headline text-base font-bold text-ink"
                >
                  Home
                </Link>
                {categories.map((c) => (
                  <Link
                    key={c.slug}
                    href={`/category/${c.slug}`}
                    onClick={() => setOpen(false)}
                    className="py-3 font-headline text-base font-bold text-ink"
                  >
                    {c.name}
                  </Link>
                ))}
              </nav>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}
