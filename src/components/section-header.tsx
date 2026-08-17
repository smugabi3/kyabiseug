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
    <div
      className="mb-5 flex items-center justify-between border-b-2 pb-2.5"
      style={{ borderColor: color ?? "var(--color-ink)" }}
    >
      <h2 className="font-headline text-ink text-xl font-extrabold tracking-tight uppercase sm:text-2xl">
        {title}
      </h2>
      {href && (
        <Link
          href={href}
          className="text-ink-muted hover:text-brand flex items-center gap-1 text-xs font-bold tracking-wide uppercase"
        >
          See all
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      )}
    </div>
  );
}
