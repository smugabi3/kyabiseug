import { prisma } from "@/lib/prisma";
import { CATEGORY_DEFS } from "@/lib/categories";

export const CATEGORY_ORDER: string[] = CATEGORY_DEFS.map((c) => c.slug);

/** Shape the public pages render, whether it came from the database or the static defs. */
export type CategoryView = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  color: string;
};

function fromDef(def: (typeof CATEGORY_DEFS)[number]): CategoryView {
  return {
    id: def.slug,
    slug: def.slug,
    name: def.name,
    description: def.description,
    color: def.color,
  };
}

/**
 * The seven sections are structural constants of the site (see lib/categories.ts),
 * not user-authored data — the nav, the homepage rows and the section colours are all
 * built around them. The database rows only enrich them.
 *
 * So if the table is empty (a fresh deployment where the seed hasn't run yet) we fall
 * back to the static definitions rather than rendering a site with no navigation.
 */
export async function getCategories(): Promise<CategoryView[]> {
  const categories = await prisma.category.findMany();

  if (categories.length === 0) return CATEGORY_DEFS.map(fromDef);

  return categories
    .map((c) => ({ ...c, description: c.description ?? null }))
    .sort((a, b) => CATEGORY_ORDER.indexOf(a.slug) - CATEGORY_ORDER.indexOf(b.slug));
}

/**
 * Returns null only for a genuinely unknown slug. A known section whose row hasn't been
 * seeded yet still resolves, so /category/sports renders an empty section instead of a
 * 404 — every one of these slugs is linked from the site nav, and a nav full of 404s is
 * a far worse failure than an empty section.
 */
export async function getCategoryBySlug(slug: string): Promise<CategoryView | null> {
  const category = await prisma.category.findUnique({ where: { slug } });
  if (category) return { ...category, description: category.description ?? null };

  const def = CATEGORY_DEFS.find((c) => c.slug === slug);
  return def ? fromDef(def) : null;
}

export async function getBreakingArticle() {
  return prisma.article.findFirst({
    where: { published: true, isBreaking: true },
    orderBy: { publishedAt: "desc" },
    include: { category: true },
  });
}

export async function getBreakingHeadlines(limit = 5) {
  return prisma.article.findMany({
    where: { published: true, isBreaking: true },
    orderBy: { publishedAt: "desc" },
    take: limit,
    include: { category: true },
  });
}

export async function getFeaturedArticle() {
  return prisma.article.findFirst({
    where: { published: true, isFeatured: true },
    orderBy: { publishedAt: "desc" },
    include: { category: true },
  });
}

export async function getLatestArticles(limit = 20, excludeId?: string) {
  return prisma.article.findMany({
    where: { published: true, id: excludeId ? { not: excludeId } : undefined },
    orderBy: { publishedAt: "desc" },
    take: limit,
    include: { category: true },
  });
}

export async function getArticlesByCategorySlug(
  slug: string,
  { skip = 0, take = 12 }: { skip?: number; take?: number } = {}
) {
  return prisma.article.findMany({
    where: { published: true, category: { slug } },
    orderBy: { publishedAt: "desc" },
    skip,
    take,
    include: { category: true },
  });
}

export async function countArticlesByCategorySlug(slug: string) {
  return prisma.article.count({ where: { published: true, category: { slug } } });
}

export async function getArticleBySlug(slug: string) {
  return prisma.article.findUnique({
    where: { slug },
    include: { category: true, comments: { orderBy: { createdAt: "desc" } } },
  });
}

export async function getRelatedArticles(categoryId: string, excludeId: string, limit = 4) {
  return prisma.article.findMany({
    where: { published: true, categoryId, id: { not: excludeId } },
    orderBy: { publishedAt: "desc" },
    take: limit,
    include: { category: true },
  });
}

export async function getTrendingArticles(limit = 6) {
  return prisma.article.findMany({
    where: { published: true },
    orderBy: { views: "desc" },
    take: limit,
    include: { category: true },
  });
}

export async function getVideoArticles(limit = 4) {
  return prisma.article.findMany({
    where: { published: true, isVideo: true },
    orderBy: { publishedAt: "desc" },
    take: limit,
    include: { category: true },
  });
}

export async function searchArticles(query: string, limit = 30) {
  if (!query.trim()) return [];
  return prisma.article.findMany({
    where: {
      published: true,
      OR: [
        { title: { contains: query } },
        { dek: { contains: query } },
        { content: { contains: query } },
        { tags: { contains: query } },
      ],
    },
    orderBy: { publishedAt: "desc" },
    take: limit,
    include: { category: true },
  });
}

export async function incrementViews(id: string) {
  return prisma.article.update({ where: { id }, data: { views: { increment: 1 } } });
}
