import type { Metadata } from "next";
import { ArticleCard } from "@/components/article-card";
import { SearchBox } from "@/components/search-box";
import { searchArticles } from "@/lib/data";

export const metadata: Metadata = { title: "Search" };

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = "" } = await searchParams;
  const results = q.trim() ? await searchArticles(q) : [];

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-10">
      <h1 className="font-headline text-ink text-3xl font-extrabold tracking-tight uppercase sm:text-4xl">
        Search
      </h1>
      <div className="mt-5 max-w-md">
        <SearchBox autoFocus />
      </div>

      {q.trim() && (
        <p className="text-ink-muted mt-6 text-sm">
          {results.length} result{results.length === 1 ? "" : "s"} for{" "}
          <span className="text-ink font-semibold">&ldquo;{q}&rdquo;</span>
        </p>
      )}

      {q.trim() && results.length === 0 && (
        <p className="text-ink-muted mt-10">
          No stories matched your search. Try a different keyword.
        </p>
      )}

      <div className="mt-8 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
        {results.map((a) => (
          <ArticleCard key={a.slug} article={a} />
        ))}
      </div>
    </div>
  );
}
