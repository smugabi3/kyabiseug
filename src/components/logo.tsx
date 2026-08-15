import Link from "next/link";
import { cn } from "@/lib/utils";

export function Logo({ className, tagline = false }: { className?: string; tagline?: boolean }) {
  return (
    <Link href="/" className={cn("group inline-flex flex-col leading-none", className)}>
      <span className="inline-flex items-center gap-0.5 font-headline">
        <span className="text-[1.6rem] font-extrabold tracking-tight text-ink">Kyabise</span>
        <span className="rounded-[4px] bg-brand px-1.5 py-0.5 text-[1.4rem] font-black tracking-tight text-white">
          UG
        </span>
      </span>
      {tagline && (
        <span className="mt-0.5 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-ink-soft">
          Uganda&apos;s Voice &middot; The World&apos;s Story
        </span>
      )}
    </Link>
  );
}
