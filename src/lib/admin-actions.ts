"use server";

import { prisma } from "@/lib/prisma";
import { createSession, destroySession, getCurrentUser, verifyPassword } from "@/lib/auth";
import { canManageAllArticles, canManageOwnArticles } from "@/lib/roles";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { slugify, toHtmlParagraphs } from "@/lib/content";

/** Coarse gate: must be logged in at all. Returns the fresh user record. */
async function requireUser() {
  const user = await getCurrentUser();
  if (!user) redirect("/admin/login");
  return user;
}

/** Fine-grained gate: must be logged in AND allowed to touch articles at all. */
async function requireArticleAccess() {
  const user = await requireUser();
  if (!canManageOwnArticles(user.role)) redirect("/admin");
  return user;
}

export async function loginAction(
  _prevState: { error?: string } | undefined,
  formData: FormData
): Promise<{ error?: string }> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !(await verifyPassword(password, user.password))) {
    return { error: "Invalid email or password." };
  }

  await createSession(user.id);
  redirect("/admin");
}

export async function logoutAction() {
  await destroySession();
  redirect("/admin/login");
}

export async function createArticleAction(formData: FormData) {
  const user = await requireArticleAccess();

  const title = String(formData.get("title") ?? "").trim();
  const dek = String(formData.get("dek") ?? "").trim();
  const contentRaw = String(formData.get("content") ?? "").trim();
  const categoryId = String(formData.get("categoryId") ?? "");
  const author = String(formData.get("author") ?? "").trim();
  const location = String(formData.get("location") ?? "").trim();
  const tags = String(formData.get("tags") ?? "").trim();
  const coverImage = String(formData.get("coverImage") ?? "").trim();
  const videoUrl = String(formData.get("videoUrl") ?? "").trim();
  const isBreaking = formData.get("isBreaking") === "on";
  const isFeatured = formData.get("isFeatured") === "on";
  const isVideo = formData.get("isVideo") === "on";
  const published = formData.get("published") === "on";

  if (!title || !dek || !contentRaw || !categoryId || !author) return;

  let slug = slugify(title);
  const existing = await prisma.article.findUnique({ where: { slug } });
  if (existing) slug = `${slug}-${Date.now().toString(36)}`;

  await prisma.article.create({
    data: {
      slug,
      title,
      dek,
      content: toHtmlParagraphs(contentRaw),
      categoryId,
      author,
      authorId: user.id,
      location: location || null,
      tags: tags || null,
      coverImage: coverImage || `https://picsum.photos/seed/${slug}/1200/800`,
      videoUrl: isVideo && videoUrl ? videoUrl : null,
      isBreaking,
      isFeatured,
      isVideo,
      published,
    },
  });

  revalidatePath("/admin");
  revalidatePath("/");
  redirect("/admin");
}

export async function updateArticleAction(id: string, formData: FormData) {
  const user = await requireArticleAccess();

  const article = await prisma.article.findUnique({ where: { id } });
  if (!article) return;

  // Authors may only touch their own bylined work; editors and admins may touch any.
  if (!canManageAllArticles(user.role) && article.authorId !== user.id) {
    redirect("/admin");
  }

  const title = String(formData.get("title") ?? "").trim();
  const dek = String(formData.get("dek") ?? "").trim();
  const contentRaw = String(formData.get("content") ?? "").trim();
  const categoryId = String(formData.get("categoryId") ?? "");
  const author = String(formData.get("author") ?? "").trim();
  const location = String(formData.get("location") ?? "").trim();
  const tags = String(formData.get("tags") ?? "").trim();
  const coverImage = String(formData.get("coverImage") ?? "").trim();
  const videoUrl = String(formData.get("videoUrl") ?? "").trim();
  const isBreaking = formData.get("isBreaking") === "on";
  const isFeatured = formData.get("isFeatured") === "on";
  const isVideo = formData.get("isVideo") === "on";
  const published = formData.get("published") === "on";

  if (!title || !dek || !contentRaw || !categoryId || !author) return;

  await prisma.article.update({
    where: { id },
    data: {
      title,
      dek,
      content: toHtmlParagraphs(contentRaw),
      categoryId,
      author,
      location: location || null,
      tags: tags || null,
      coverImage: coverImage || article.coverImage,
      videoUrl: isVideo && videoUrl ? videoUrl : null,
      isBreaking,
      isFeatured,
      isVideo,
      published,
    },
  });

  revalidatePath("/admin");
  revalidatePath("/");
  revalidatePath(`/article/${article.slug}`);
  redirect("/admin");
}

export async function deleteArticleAction(id: string) {
  const user = await requireArticleAccess();

  const article = await prisma.article.findUnique({ where: { id } });
  if (!article) return;
  if (!canManageAllArticles(user.role) && article.authorId !== user.id) return;

  await prisma.article.delete({ where: { id } });
  revalidatePath("/admin");
  revalidatePath("/");
}

export async function togglePublishAction(id: string) {
  const user = await requireArticleAccess();

  const article = await prisma.article.findUnique({ where: { id } });
  if (!article) return;
  if (!canManageAllArticles(user.role) && article.authorId !== user.id) return;

  await prisma.article.update({ where: { id }, data: { published: !article.published } });
  revalidatePath("/admin");
  revalidatePath("/");
}
