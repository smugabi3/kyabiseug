import { ArticleCard } from "@/components/article-card";
import { SectionHeader } from "@/components/section-header";
import { TrendingSidebar } from "@/components/trending-sidebar";
import { VideoSection } from "@/components/video-section";
import { HeroSlider, type HeroSlide } from "@/components/hero-slider";
import {
  getArticlesByCategorySlug,
  getCategories,
  getTrendingArticles,
  getVideoArticles,
} from "@/lib/data";
import { categoryColor } from "@/lib/categories";
import { recordPageView } from "@/lib/analytics";

// Rendered per-request rather than prerendered at build time: the homepage reflects
// whatever editors have just published, and the build shouldn't need a live database.
export const dynamic = "force-dynamic";

/** Categories featured in the homepage slider, in rotation order. */
const SLIDER_CATEGORIES = ["local", "international", "business", "sports"] as const;

export default async function HomePage() {
  await recordPageView("/");
  const categories = await getCategories();
  const [localArticles, trending, videos, sliderPicks] = await Promise.all([
    getArticlesByCategorySlug("local", { take: 6 }),
    getTrendingArticles(6),
    getVideoArticles(4),
    Promise.all(SLIDER_CATEGORIES.map((slug) => getArticlesByCategorySlug(slug, { take: 1 }))),
  ]);

  // One slide per category. A category with nothing published yet is skipped
  // rather than rendering an empty slide.
  const slides: HeroSlide[] = sliderPicks
    .map(([article]) => article)
    .filter((a) => a !== undefined)
    .map((a) => ({
      slug: a.slug,
      title: a.title,
      dek: a.dek,
      coverImage: a.coverImage,
      author: a.author,
      // Serialised for the client component; timeAgo re-parses it there.
      publishedAt: a.publishedAt.toISOString(),
      isBreaking: a.isBreaking,
      category: { slug: a.category.slug, name: a.category.name },
    }));

  const [, ...localRest] = localArticles;
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
          <HeroSlider slides={slides} />

          {heroSecondary.length > 0 && (
            <div className="border-border mt-8 grid gap-6 border-t pt-6 sm:grid-cols-2">
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
          <SectionHeader
            title="More Local News"
            href="/category/local"
            color={categoryColor("local")}
          />
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
