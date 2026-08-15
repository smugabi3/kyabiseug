import { notFound, redirect } from "next/navigation";
import { ArticleForm } from "@/components/admin/article-form";
import { AdminShell } from "@/components/admin/admin-shell";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { canManageAllArticles, canManageOwnArticles } from "@/lib/roles";
import { updateArticleAction } from "@/lib/admin-actions";
import { htmlToPlainParagraphs } from "@/lib/content";

export default async function EditArticlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/admin/login");
  if (!canManageOwnArticles(user.role)) redirect("/admin");

  const { id } = await params;
  const [article, categories] = await Promise.all([
    prisma.article.findUnique({ where: { id } }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
  ]);
  if (!article) notFound();

  // Authors may only open their own bylined work — block the view, not just the save,
  // so a direct URL guess can't leak another contributor's draft content.
  if (!canManageAllArticles(user.role) && article.authorId !== user.id) {
    redirect("/admin");
  }

  return (
    <AdminShell user={user} active="other">
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <h1 className="mb-8 font-headline text-3xl font-extrabold uppercase tracking-tight text-ink">
          Edit Article
        </h1>
        <ArticleForm
          categories={categories}
          action={updateArticleAction.bind(null, article.id)}
          submitLabel="Save Changes"
          defaults={{
            title: article.title,
            dek: article.dek,
            content: htmlToPlainParagraphs(article.content),
            categoryId: article.categoryId,
            author: article.author,
            location: article.location ?? "",
            tags: article.tags ?? "",
            coverImage: article.coverImage,
            videoUrl: article.videoUrl ?? "",
            isBreaking: article.isBreaking,
            isFeatured: article.isFeatured,
            isVideo: article.isVideo,
            published: article.published,
          }}
        />
      </div>
    </AdminShell>
  );
}
