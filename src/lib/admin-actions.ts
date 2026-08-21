"use server";

import { prisma } from "@/lib/prisma";
import {
  createSession,
  destroySession,
  getCurrentUser,
  refreshSession,
  verifyPassword,
} from "@/lib/auth";
import { canManageAllArticles, canManageOwnArticles } from "@/lib/roles";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { slugify, toHtmlParagraphs } from "@/lib/content";
import { uploadCoverImage } from "@/lib/upload";

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

/** Failed sign-ins allowed for one address before it is temporarily locked. */
const MAX_LOGIN_ATTEMPTS = 5;
const LOGIN_WINDOW_MINUTES = 15;

/**
 * A bcrypt hash of a value nobody knows, compared against when the email doesn't
 * exist. Without it, a missing account returns instantly while a real one pays
 * the cost of a bcrypt comparison — a timing difference that lets an attacker
 * discover which staff addresses are real before guessing any passwords.
 */
const DUMMY_HASH = "$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy";

export async function loginAction(
  _prevState: { error?: string } | undefined,
  formData: FormData
): Promise<{ error?: string }> {
  // Accounts are stored lower-cased, so without normalising here a staff member
  // whose keyboard capitalised the first letter would be told their correct
  // password was wrong.
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) return { error: "Invalid email or password." };

  const since = new Date(Date.now() - LOGIN_WINDOW_MINUTES * 60 * 1000);
  const recentFailures = await prisma.loginAttempt.count({
    where: { email, createdAt: { gte: since } },
  });

  if (recentFailures >= MAX_LOGIN_ATTEMPTS) {
    return {
      error: `Too many failed attempts. Please wait ${LOGIN_WINDOW_MINUTES} minutes and try again.`,
    };
  }

  const user = await prisma.user.findUnique({ where: { email } });
  const ok = await verifyPassword(password, user?.password ?? DUMMY_HASH);

  if (!user || !ok) {
    await prisma.loginAttempt.create({ data: { email } });
    return { error: "Invalid email or password." };
  }

  // Clear the slate so an earlier fumbled password doesn't count against a
  // legitimate user later in the day.
  await prisma.loginAttempt.deleteMany({ where: { email } });

  await createSession(user.id);
  redirect("/admin");
}

export async function logoutAction() {
  await destroySession();
  redirect("/admin/login");
}

/** Ends the session and flags the login page to explain why. */
export async function idleLogoutAction() {
  await destroySession();
  redirect("/admin/login?reason=idle");
}

/**
 * Extends the rolling idle window for a user who is still active. Returns
 * `{ alive: false }` once the session has lapsed so the browser can stop
 * polling and send them to the login page.
 */
export async function heartbeatAction(): Promise<{ alive: boolean }> {
  return { alive: await refreshSession() };
}

export async function createArticleAction(
  _prevState: { error?: string } | undefined,
  formData: FormData
): Promise<{ error?: string }> {
  const user = await requireArticleAccess();

  const title = String(formData.get("title") ?? "").trim();
  const dek = String(formData.get("dek") ?? "").trim();
  const contentRaw = String(formData.get("content") ?? "").trim();
  const categoryId = String(formData.get("categoryId") ?? "");
  const author = String(formData.get("author") ?? "").trim();
  const location = String(formData.get("location") ?? "").trim();
  const tags = String(formData.get("tags") ?? "").trim();
  const coverImageFile = formData.get("coverImageFile");
  const videoUrl = String(formData.get("videoUrl") ?? "").trim();
  const isBreaking = formData.get("isBreaking") === "on";
  const isFeatured = formData.get("isFeatured") === "on";
  const isVideo = formData.get("isVideo") === "on";
  const published = formData.get("published") === "on";

  if (!title || !dek || !contentRaw || !categoryId || !author) {
    return { error: "Please fill in all required fields." };
  }

  let slug = slugify(title);
  const existing = await prisma.article.findUnique({ where: { slug } });
  if (existing) slug = `${slug}-${Date.now().toString(36)}`;

  let coverImage = `https://picsum.photos/seed/${slug}/1200/800`;
  if (coverImageFile instanceof File && coverImageFile.size > 0) {
    const result = await uploadCoverImage(coverImageFile, slug);
    if ("error" in result) return { error: result.error };
    coverImage = result.url;
  }

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
      coverImage,
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

export async function updateArticleAction(
  id: string,
  _prevState: { error?: string } | undefined,
  formData: FormData
): Promise<{ error?: string }> {
  const user = await requireArticleAccess();

  const article = await prisma.article.findUnique({ where: { id } });
  if (!article) return { error: "That article no longer exists." };

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
  const coverImageFile = formData.get("coverImageFile");
  const videoUrl = String(formData.get("videoUrl") ?? "").trim();
  const isBreaking = formData.get("isBreaking") === "on";
  const isFeatured = formData.get("isFeatured") === "on";
  const isVideo = formData.get("isVideo") === "on";
  const published = formData.get("published") === "on";

  if (!title || !dek || !contentRaw || !categoryId || !author) {
    return { error: "Please fill in all required fields." };
  }

  let coverImage = article.coverImage;
  if (coverImageFile instanceof File && coverImageFile.size > 0) {
    const result = await uploadCoverImage(coverImageFile, article.slug);
    if ("error" in result) return { error: result.error };
    coverImage = result.url;
  }

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
      coverImage,
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
