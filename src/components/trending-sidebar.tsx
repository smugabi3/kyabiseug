import Link from "next/link";
import { CategoryBadge } from "@/components/category-badge";
import { TrendingUp } from "lucide-react";

type Item = {
  slug: string;
  title: string;
  category: { slug: string; name: string };
};

export function TrendingSidebar({ items }: { items: Item[] }) {
  return (
    <div className="rounded-xl border border-border bg-surface-alt p-5">
      <div className="mb-4 flex items-center gap-2 border-b-2 border-ink pb-2.5">
        <TrendingUp className="h-4 w-4 text-brand" />
        <h2 className="font-headline text-lg font-extrabold uppercase tracking-tight text-ink">
          Trending Now
        </h2>
      </div>
      <ol className="space-y-4">
        {items.map((item, i) => (
          <li key={item.slug} className="flex gap-3">
            <span className="font-headline text-2xl font-black text-ink-soft/40">
              {String(i + 1).padStart(2, "0")}
            </span>
            <div className="min-w-0">
              <CategoryBadge slug={item.category.slug} name={item.category.name} />
              <Link href={`/article/${item.slug}`} className="group block">
                <h3 className="mt-1 line-clamp-2 font-headline text-sm font-bold leading-snug text-ink group-hover:text-brand">
                  {item.title}
                </h3>
              </Link>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
