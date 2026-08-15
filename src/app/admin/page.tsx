import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { AdminShell } from "@/components/admin/admin-shell";
import { deleteArticleAction, togglePublishAction } from "@/lib/admin-actions";
import { canAccessNewsroom, canManageAllArticles, canManageUsers, ROLE_LABELS } from "@/lib/roles";
import { timeAgo } from "@/lib/utils";
import { Eye, FileText, MessageCircle, Plus, Users } from "lucide-react";

export default async function AdminDashboard() {
  const user = await getCurrentUser();
  if (!user) redirect("/admin/login");

  if (!canAccessNewsroom(user.role)) {
    return (
      <AdminShell user={user} active="dashboard">
        <div className="mx-auto max-w-2xl px-4 py-16 text-center sm:px-6">
          <h1 className="font-headline text-3xl font-extrabold uppercase tracking-tight text-ink">
            Welcome, {user.name}
          </h1>
          <p className="mt-3 text-ink-muted">
            Your account is registered as a <strong>{ROLE_LABELS.subscriber}</strong>. This tier
            doesn&apos;t include access to the newsroom — no articles or team members to manage
            here. If you believe this is a mistake, ask a KyabiseUG admin to change your role.
          </p>
          <Link
            href="/"
            className="mt-6 inline-block rounded-full bg-brand px-5 py-2.5 font-headline text-sm font-bold uppercase tracking-wide text-white transition hover:bg-brand-ink"
          >
            Back to KyabiseUG
          </Link>
        </div>
      </AdminShell>
    );
  }

  const seeAll = canManageAllArticles(user.role);
  const articleWhere = seeAll ? {} : { authorId: user.id };

  const [articles, articleCount, totalViewsAgg, commentCount, subscriberCount, teamCount] =
    await Promise.all([
      prisma.article.findMany({
        where: articleWhere,
        orderBy: { publishedAt: "desc" },
        include: { category: true },
      }),
      prisma.article.count({ where: articleWhere }),
      prisma.article.aggregate({ where: articleWhere, _sum: { views: true } }),
      seeAll ? prisma.comment.count() : Promise.resolve(null),
      seeAll ? prisma.newsletterSubscriber.count() : Promise.resolve(null),
      canManageUsers(user.role) ? prisma.user.count() : Promise.resolve(null),
    ]);

  const totalViews = totalViewsAgg._sum.views ?? 0;

  return (
    <AdminShell user={user} active="dashboard">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="font-headline text-3xl font-extrabold uppercase tracking-tight text-ink">
              {seeAll ? "Newsroom Dashboard" : "My Articles"}
            </h1>
            <p className="mt-1 text-sm text-ink-muted">
              Welcome back, {user.name}
              {!seeAll && " — showing only the stories bylined to you."}
            </p>
          </div>
          <Link
            href="/admin/articles/new"
            className="flex items-center gap-1.5 rounded-full bg-brand px-4 py-2.5 font-headline text-xs font-bold uppercase tracking-wide text-white transition hover:bg-brand-ink"
          >
            <Plus className="h-4 w-4" />
            New Article
          </Link>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            icon={<FileText className="h-4 w-4" />}
            label={seeAll ? "Articles" : "My Articles"}
            value={articleCount}
          />
          <StatCard
            icon={<Eye className="h-4 w-4" />}
            label={seeAll ? "Total Views" : "My Views"}
            value={totalViews}
          />
          {commentCount !== null && (
            <StatCard icon={<MessageCircle className="h-4 w-4" />} label="Comments" value={commentCount} />
          )}
          {subscriberCount !== null && (
            <StatCard icon={<Users className="h-4 w-4" />} label="Subscribers" value={subscriberCount} />
          )}
          {teamCount !== null && (
            <StatCard icon={<Users className="h-4 w-4" />} label="Team Members" value={teamCount} />
          )}
        </div>

        <div className="mt-10 overflow-x-auto rounded-xl border border-border bg-surface">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="border-b border-border bg-surface-alt text-xs font-bold uppercase tracking-wide text-ink-muted">
              <tr>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Category</th>
                {seeAll && <th className="px-4 py-3">Byline</th>}
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Views</th>
                <th className="px-4 py-3">Published</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {articles.length === 0 && (
                <tr>
                  <td colSpan={seeAll ? 7 : 6} className="px-4 py-10 text-center text-ink-muted">
                    No articles yet. Create your first story.
                  </td>
                </tr>
              )}
              {articles.map((a) => (
                <tr key={a.id}>
                  <td className="max-w-xs truncate px-4 py-3 font-medium text-ink">{a.title}</td>
                  <td className="px-4 py-3 text-ink-muted">{a.category.name}</td>
                  {seeAll && <td className="px-4 py-3 text-ink-muted">{a.author}</td>}
                  <td className="px-4 py-3">
                    <span
                      className={
                        a.published
                          ? "rounded-full bg-cat-sports/10 px-2.5 py-1 text-xs font-bold text-cat-sports"
                          : "rounded-full bg-ink-soft/10 px-2.5 py-1 text-xs font-bold text-ink-soft"
                      }
                    >
                      {a.published ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-ink-muted">{a.views.toLocaleString()}</td>
                  <td className="px-4 py-3 text-ink-muted">{timeAgo(a.publishedAt)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-3 text-xs font-bold uppercase tracking-wide">
                      <Link href={`/admin/articles/${a.id}/edit`} className="text-ink-muted hover:text-brand">
                        Edit
                      </Link>
                      <form action={togglePublishAction.bind(null, a.id)}>
                        <button type="submit" className="text-ink-muted hover:text-brand">
                          {a.published ? "Unpublish" : "Publish"}
                        </button>
                      </form>
                      <form action={deleteArticleAction.bind(null, a.id)}>
                        <button type="submit" className="text-brand hover:text-brand-ink">
                          Delete
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminShell>
  );
}

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-xl border border-border bg-surface p-5">
      <div className="flex items-center gap-2 text-ink-soft">
        {icon}
        <span className="text-xs font-bold uppercase tracking-wide">{label}</span>
      </div>
      <p className="mt-2 font-headline text-3xl font-extrabold text-ink">
        {value.toLocaleString()}
      </p>
    </div>
  );
}
