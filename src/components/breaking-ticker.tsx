import Link from "next/link";

type BreakingItem = { slug: string; title: string };

export function BreakingTicker({ items }: { items: BreakingItem[] }) {
  if (items.length === 0) return null;
  const loop = [...items, ...items];

  return (
    <div className="flex items-stretch border-b border-border bg-ink-static text-white">
      <span className="flex shrink-0 items-center gap-1.5 bg-brand px-3 py-2 font-headline text-xs font-bold uppercase tracking-wider">
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" />
        Breaking
      </span>
      <div className="relative flex-1 overflow-hidden">
        <div className="animate-ticker flex w-max items-center gap-10 whitespace-nowrap py-2 pl-6 text-sm">
          {loop.map((item, i) => (
            <Link
              key={`${item.slug}-${i}`}
              href={`/article/${item.slug}`}
              className="shrink-0 hover:text-gold hover:underline"
            >
              {item.title}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
