import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function SectionHeader({
  title,
  href,
  color,
}: {
  title: string;
  href?: string;
  color?: string;
}) {
  return (
    <div className="mb-5 flex items-center justify-between border-b-2 pb-2.5" style={{ borderColor: color ?? "var(--color-ink)" }}>
      <h2 className="font-headline text-xl font-extrabold uppercase tracking-tight text-ink sm:text-2xl">
        {title}
      </h2>
      {href && (
        <Link
          href={href}
          className="flex items-center gap-1 text-xs font-bold uppercase tracking-wide text-ink-muted hover:text-brand"
        >
          See all
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      )}
    </div>
  );
}
