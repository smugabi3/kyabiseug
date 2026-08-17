import Link from "next/link";
import { cn } from "@/lib/utils";

export function Logo({ className, tagline = false }: { className?: string; tagline?: boolean }) {
  return (
    <Link href="/" className={cn("group inline-flex flex-col leading-none", className)}>
      <span className="font-headline inline-flex items-center gap-0.5">
        <span className="text-ink text-[1.6rem] font-extrabold tracking-tight">Kyabise</span>
        <span className="bg-brand rounded-[4px] px-1.5 py-0.5 text-[1.4rem] font-black tracking-tight text-white">
          UG
        </span>
      </span>
      {tagline && (
        <span className="text-ink-soft mt-0.5 text-[0.65rem] font-semibold tracking-[0.18em] uppercase">
          Uganda&apos;s Voice &middot; The World&apos;s Story
        </span>
      )}
    </Link>
  );
}
