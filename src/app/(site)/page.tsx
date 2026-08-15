import Image from "next/image";
import Link from "next/link";
import { CategoryBadge } from "@/components/category-badge";
import { ArticleCard } from "@/components/article-card";
import { SectionHeader } from "@/components/section-header";
import { TrendingSidebar } from "@/components/trending-sidebar";
import { VideoSection } from "@/components/video-section";
import {
  getArticlesByCategorySlug,
  getCategories,
  getTrendingArticles,
  getVideoArticles,
} from "@/lib/data";
import { categoryColor } from "@/lib/categories";
import { timeAgo } from "@/lib/utils";

// Rendered per-request rather than prerendered at build time: the homepage reflects
// whatever editors have just published, and the build shouldn't need a live database.
export const dynamic = "force-dynamic";

export default async function HomePage() {
  const categories = await getCategories();
  const [localArticles, trending, videos] = await Promise.all([
    getArticlesByCategorySlug("local", { take: 6 }),
    getTrendingArticles(6),
    getVideoArticles(4),
  ]);

  const [hero, ...localRest] = localArticles;
  const heroSecondary = localRest.slice(0, 2);
  const localMore = localRest.slice(2, 4);

  const otherCategories = categories.filter((c) => c.slug !== "local");
  const sections = await Promise.all(
    otherCategories.map(async (c) => ({
      category: c,
      articles: await getArticlesByCategorySlug(c.slug, { take: 5 }),
    }))
  );

  return (
    <div className="mx-auto max-w-7xl space-y-14 px-4 py-8 sm:px-6 lg:px-10">
      {/* HERO */}
      <section className="grid gap-8 lg:grid-cols-[2fr_1fr]">
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h1 className="font-headline text-2xl font-extrabold uppercase tracking-tight text-cat-local sm:text-3xl">
              Uganda Today
            </h1>
            <Link
              href="/category/local"
              className="text-xs font-bold uppercase tracking-wide text-ink-muted hover:text-brand"
            >
              All Local News
            </Link>
          </div>

          {hero && (
            <div className="group block">
              <Link
                href={`/article/${hero.slug}`}
                className="relative block aspect-[16/9] overflow-hidden rounded-xl bg-surface-alt sm:aspect-[2/1]"
              >
                <Image
                  src={hero.coverImage}
                  alt=""
                  fill
                  priority
                  sizes="(min-width: 1024px) 66vw, 100vw"
                  className="object-cover transition duration-300 group-hover:scale-105"
                />
                {hero.isBreaking && (
                  <span className="absolute left-4 top-4 rounded bg-brand px-2.5 py-1 font-headline text-xs font-bold uppercase tracking-wider text-white shadow">
                    Breaking
                  </span>
                )}
              </Link>
              <div className="mt-4">
                <CategoryBadge slug={hero.category.slug} name={hero.category.name} size="md" />
                <Link href={`/article/${hero.slug}`}>
                  <h2 className="mt-2 font-headline text-3xl font-extrabold leading-[1.05] text-ink group-hover:text-brand sm:text-4xl">
                    {hero.title}
                  </h2>
                </Link>
                <p className="mt-3 max-w-2xl text-base leading-relaxed text-ink-muted">
                  {hero.dek}
                </p>
                <p className="mt-3 text-xs text-ink-soft">
                  By {hero.author} &middot; {timeAgo(hero.publishedAt)}
                </p>
              </div>
            </div>
          )}

          {heroSecondary.length > 0 && (
            <div className="mt-8 grid gap-6 border-t border-border pt-6 sm:grid-cols-2">
              {heroSecondary.map((a) => (
                <ArticleCard key={a.slug} article={a} />
              ))}
            </div>
          )}
        </div>

        <TrendingSidebar items={trending} />
      </section>

      {localMore.length > 0 && (
        <section>
          <SectionHeader title="More Local News" href="/category/local" color={categoryColor("local")} />
          <div className="grid gap-6 sm:grid-cols-2">
            {localMore.map((a) => (
              <ArticleCard key={a.slug} article={a} variant="horizontal" />
            ))}
          </div>
        </section>
      )}

      <VideoSection items={videos} />

      {sections.map(({ category, articles }) => {
        if (articles.length === 0) return null;
        const [feature, ...rest] = articles;
        return (
          <section key={category.slug}>
            <SectionHeader
              title={category.name}
              href={`/category/${category.slug}`}
              color={category.color}
            />
            <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
              <ArticleCard article={feature} variant="horizontal" />
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
                {rest.slice(0, 3).map((a) => (
                  <ArticleCard key={a.slug} article={a} variant="compact" />
                ))}
              </div>
            </div>
          </section>
        );
      })}
    </div>
  );
}
