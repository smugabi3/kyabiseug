import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { CategoryBadge } from "@/components/category-badge";
import { ArticleCard } from "@/components/article-card";
import { ShareButtons } from "@/components/share-buttons";
import { CommentSection } from "@/components/comment-section";
import { getArticleBySlug, getRelatedArticles, incrementViews } from "@/lib/data";
import { longDate, readingTime } from "@/lib/utils";
import { MapPin, Clock } from "lucide-react";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) return {};
  return {
    title: article.title,
    description: article.dek,
    openGraph: {
      title: article.title,
      description: article.dek,
      images: [article.coverImage],
      type: "article",
    },
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) notFound();

  incrementViews(article.id).catch(() => {});

  const related = await getRelatedArticles(article.categoryId, article.id, 4);
  const embedUrl = article.videoUrl
    ? `${article.videoUrl}${article.videoUrl.includes("?") ? "&" : "?"}rel=0`
    : null;

  return (
    <article className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <CategoryBadge slug={article.category.slug} name={article.category.name} size="md" />

      <h1 className="mt-3 font-headline text-3xl font-extrabold leading-[1.1] text-ink sm:text-4xl lg:text-5xl">
        {article.title}
      </h1>
      <p className="mt-4 text-lg leading-relaxed text-ink-muted">{article.dek}</p>

      <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 border-y border-border py-4 text-sm text-ink-muted">
        <span className="font-semibold text-ink">By {article.author}</span>
        <span>{longDate(article.publishedAt)}</span>
        <span className="flex items-center gap-1">
          <Clock className="h-3.5 w-3.5" />
          {readingTime(article.content)} min read
        </span>
        {article.location && (
          <span className="flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5" />
            {article.location}
          </span>
        )}
        <div className="ml-auto">
          <ShareButtons title={article.title} path={`/article/${article.slug}`} />
        </div>
      </div>

      {embedUrl ? (
        <div className="relative mt-6 aspect-video overflow-hidden rounded-xl bg-ink">
          <iframe
            src={embedUrl}
            title={article.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 h-full w-full"
          />
        </div>
      ) : (
        <div className="relative mt-6 aspect-[16/10] overflow-hidden rounded-xl bg-surface-alt">
          <Image
            src={article.coverImage}
            alt={article.title}
            fill
            priority
            sizes="(min-width: 768px) 768px, 100vw"
            className="object-cover"
          />
        </div>
      )}

      <div
        className="prose-article mt-8"
        dangerouslySetInnerHTML={{ __html: article.content }}
      />

      {article.tags && (
        <div className="mt-8 flex flex-wrap gap-2">
          {article.tags.split(",").map((t) => (
            <span
              key={t}
              className="rounded-full border border-border px-3 py-1 text-xs text-ink-muted"
            >
              #{t.trim()}
            </span>
          ))}
        </div>
      )}

      {related.length > 0 && (
        <section className="mt-14 border-t border-border pt-8">
          <h2 className="mb-5 font-headline text-xl font-extrabold uppercase tracking-tight text-ink">
            More in {article.category.name}
          </h2>
          <div className="grid gap-6 sm:grid-cols-2">
            {related.map((a) => (
              <ArticleCard key={a.slug} article={a} variant="horizontal" showDek={false} />
            ))}
          </div>
        </section>
      )}

      <CommentSection articleId={article.id} slug={article.slug} comments={article.comments} />
    </article>
  );
}
