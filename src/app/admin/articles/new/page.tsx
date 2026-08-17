import { redirect } from "next/navigation";
import { ArticleForm } from "@/components/admin/article-form";
import { AdminShell } from "@/components/admin/admin-shell";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { canManageOwnArticles } from "@/lib/roles";
import { createArticleAction } from "@/lib/admin-actions";

export default async function NewArticlePage() {
  const user = await getCurrentUser();
  if (!user) redirect("/admin/login");
  if (!canManageOwnArticles(user.role)) redirect("/admin");

  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });

  return (
    <AdminShell user={user} active="other">
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <h1 className="font-headline text-ink mb-8 text-3xl font-extrabold tracking-tight uppercase">
          New Article
        </h1>
        <ArticleForm
          categories={categories}
          action={createArticleAction}
          submitLabel="Publish Story"
          defaults={{ author: user.name }}
        />
      </div>
    </AdminShell>
  );
}
