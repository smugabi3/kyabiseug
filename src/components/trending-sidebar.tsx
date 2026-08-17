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
    <div className="border-border bg-surface-alt rounded-xl border p-5">
      <div className="border-ink mb-4 flex items-center gap-2 border-b-2 pb-2.5">
        <TrendingUp className="text-brand h-4 w-4" />
        <h2 className="font-headline text-ink text-lg font-extrabold tracking-tight uppercase">
          Trending Now
        </h2>
      </div>
      <ol className="space-y-4">
        {items.map((item, i) => (
          <li key={item.slug} className="flex gap-3">
            <span className="font-headline text-ink-soft/40 text-2xl font-black">
              {String(i + 1).padStart(2, "0")}
            </span>
            <div className="min-w-0">
              <CategoryBadge slug={item.category.slug} name={item.category.name} />
              <Link href={`/article/${item.slug}`} className="group block">
                <h3 className="font-headline text-ink group-hover:text-brand mt-1 line-clamp-2 text-sm leading-snug font-bold">
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
