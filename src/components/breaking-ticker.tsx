import Link from "next/link";

type BreakingItem = { slug: string; title: string };

export function BreakingTicker({ items }: { items: BreakingItem[] }) {
  if (items.length === 0) return null;
  const loop = [...items, ...items];

  return (
    <div className="border-border bg-ink-static flex items-stretch border-b text-white">
      <span className="bg-brand font-headline flex shrink-0 items-center gap-1.5 px-3 py-2 text-xs font-bold tracking-wider uppercase">
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" />
        Breaking
      </span>
      <div className="relative flex-1 overflow-hidden">
        <div className="animate-ticker flex w-max items-center gap-10 py-2 pl-6 text-sm whitespace-nowrap">
          {loop.map((item, i) => (
            <Link
              key={`${item.slug}-${i}`}
              href={`/article/${item.slug}`}
              className="hover:text-gold shrink-0 hover:underline"
            >
              {item.title}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
