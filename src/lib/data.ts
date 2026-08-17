import { prisma } from "@/lib/prisma";

export const CATEGORY_ORDER = [
  "local",
  "international",
  "sports",
  "health",
  "tech",
  "gospel",
  "entertainment",
];

export async function getCategories() {
  const categories = await prisma.category.findMany();
  return categories.sort((a, b) => CATEGORY_ORDER.indexOf(a.slug) - CATEGORY_ORDER.indexOf(b.slug));
}

export async function getCategoryBySlug(slug: string) {
  return prisma.category.findUnique({ where: { slug } });
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
