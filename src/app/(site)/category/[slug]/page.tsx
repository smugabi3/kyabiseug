import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArticleCard } from "@/components/article-card";
import {
  countArticlesByCategorySlug,
  getArticlesByCategorySlug,
  getCategoryBySlug,
} from "@/lib/data";
import { ChevronLeft, ChevronRight } from "lucide-react";

const PAGE_SIZE = 12;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) return {};
  return {
    title: category.name,
    description: category.description ?? undefined,
  };
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const { slug } = await params;
  const { page: pageParam } = await searchParams;
  const category = await getCategoryBySlug(slug);
  if (!category) notFound();

  const page = Math.max(1, Number(pageParam) || 1);
  const [articles, total] = await Promise.all([
    getArticlesByCategorySlug(slug, { skip: (page - 1) * PAGE_SIZE, take: PAGE_SIZE }),
    countArticlesByCategorySlug(slug),
  ]);
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-10">
      <div className="mb-10 border-b-4 pb-4" style={{ borderColor: category.color }}>
        <h1
          className="font-headline text-4xl font-extrabold uppercase tracking-tight sm:text-5xl"
          style={{ color: category.color }}
        >
          {category.name}
        </h1>
        {category.description && (
          <p className="mt-2 max-w-xl text-ink-muted">{category.description}</p>
        )}
      </div>

      {articles.length === 0 ? (
        <p className="text-ink-muted">No stories published in this section yet.</p>
      ) : (
        <div className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((a) => (
            <ArticleCard key={a.slug} article={a} />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="mt-12 flex items-center justify-center gap-3">
          <PageLink slug={slug} page={page - 1} disabled={page <= 1}>
            <ChevronLeft className="h-4 w-4" />
          </PageLink>
          <span className="font-headline text-sm font-bold text-ink-muted">
            Page {page} of {totalPages}
          </span>
          <PageLink slug={slug} page={page + 1} disabled={page >= totalPages}>
            <ChevronRight className="h-4 w-4" />
          </PageLink>
        </div>
      )}
    </div>
  );
}

function PageLink({
  slug,
  page,
  disabled,
  children,
}: {
  slug: string;
  page: number;
  disabled: boolean;
  children: React.ReactNode;
}) {
  if (disabled) {
    return (
      <span className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-ink-soft/40">
        {children}
      </span>
    );
  }
  return (
    <Link
      href={`/category/${slug}?page=${page}`}
      className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-ink transition hover:border-brand hover:text-brand"
    >
      {children}
    </Link>
  );
}
