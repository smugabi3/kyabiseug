import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { AdminShell } from "@/components/admin/admin-shell";
import { getAdminBadges } from "@/lib/notifications";
import { deleteArticleAction, togglePublishAction } from "@/lib/admin-actions";
import {
  canAccessNewsroom,
  canManageAllArticles,
  canManageUsers,
  canViewEnquiries,
  ROLE_LABELS,
} from "@/lib/roles";
import { timeAgo } from "@/lib/utils";
import { Eye, FileText, Inbox, MessageCircle, Plus, Users } from "lucide-react";

export default async function AdminDashboard() {
  const user = await getCurrentUser();
  if (!user) redirect("/admin/login");

  const badges = await getAdminBadges(user);
  if (!canAccessNewsroom(user.role)) {
    return (
      <AdminShell user={user} active="dashboard" badges={badges}>
        <div className="mx-auto max-w-2xl px-4 py-16 text-center sm:px-6">
          <h1 className="font-headline text-ink text-3xl font-extrabold tracking-tight uppercase">
            Welcome, {user.name}
          </h1>
          <p className="text-ink-muted mt-3">
            Your account is registered as a <strong>{ROLE_LABELS.subscriber}</strong>. This tier
            doesn&apos;t include access to the newsroom — no articles or team members to manage
            here. If you believe this is a mistake, ask a KyabiseUG admin to change your role.
          </p>
          <Link
            href="/"
            className="bg-brand font-headline hover:bg-brand-ink mt-6 inline-block rounded-full px-5 py-2.5 text-sm font-bold tracking-wide text-white uppercase transition"
          >
            Back to KyabiseUG
          </Link>
        </div>
      </AdminShell>
    );
  }

  const seeAll = canManageAllArticles(user.role);
  const articleWhere = seeAll ? {} : { authorId: user.id };

  const [
    articles,
    articleCount,
    totalViewsAgg,
    commentCount,
    subscriberCount,
    teamCount,
    enquiryCount,
  ] = await Promise.all([
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
    canViewEnquiries(user.role) ? prisma.enquiry.count() : Promise.resolve(null),
  ]);

  const totalViews = totalViewsAgg._sum.views ?? 0;

  return (
    <AdminShell user={user} active="dashboard" badges={badges}>
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="font-headline text-ink text-3xl font-extrabold tracking-tight uppercase">
              {seeAll ? "Newsroom Dashboard" : "My Articles"}
            </h1>
            <p className="text-ink-muted mt-1 text-sm">
              Welcome back, {user.name}
              {!seeAll && " — showing only the stories bylined to you."}
            </p>
          </div>
          <Link
            href="/admin/articles/new"
            className="bg-brand font-headline hover:bg-brand-ink flex items-center gap-1.5 rounded-full px-4 py-2.5 text-xs font-bold tracking-wide text-white uppercase transition"
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
            <StatCard
              icon={<MessageCircle className="h-4 w-4" />}
              label="Comments"
              value={commentCount}
            />
          )}
          {subscriberCount !== null && (
            <StatCard
              icon={<Users className="h-4 w-4" />}
              label="Subscribers"
              value={subscriberCount}
              note={badges.newSubscribers > 0 ? `${badges.newSubscribers} new` : undefined}
              href="/admin/subscribers"
            />
          )}
          {canViewEnquiries(user.role) && (
            <StatCard
              icon={<Inbox className="h-4 w-4" />}
              label="Enquiries"
              value={enquiryCount ?? 0}
              note={
                badges.unhandledEnquiries > 0
                  ? `${badges.unhandledEnquiries} awaiting reply`
                  : undefined
              }
              href="/admin/enquiries"
            />
          )}
          {teamCount !== null && (
            <StatCard icon={<Users className="h-4 w-4" />} label="Team Members" value={teamCount} />
          )}
        </div>

        <div className="border-border bg-surface mt-10 overflow-x-auto rounded-xl border">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="border-border bg-surface-alt text-ink-muted border-b text-xs font-bold tracking-wide uppercase">
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
            <tbody className="divide-border divide-y">
              {articles.length === 0 && (
                <tr>
                  <td colSpan={seeAll ? 7 : 6} className="text-ink-muted px-4 py-10 text-center">
                    No articles yet. Create your first story.
                  </td>
                </tr>
              )}
              {articles.map((a) => (
                <tr key={a.id}>
                  <td className="text-ink max-w-xs truncate px-4 py-3 font-medium">{a.title}</td>
                  <td className="text-ink-muted px-4 py-3">{a.category.name}</td>
                  {seeAll && <td className="text-ink-muted px-4 py-3">{a.author}</td>}
                  <td className="px-4 py-3">
                    <span
                      className={
                        a.published
                          ? "bg-cat-sports/10 text-cat-sports rounded-full px-2.5 py-1 text-xs font-bold"
                          : "bg-ink-soft/10 text-ink-soft rounded-full px-2.5 py-1 text-xs font-bold"
                      }
                    >
                      {a.published ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td className="text-ink-muted px-4 py-3">{a.views.toLocaleString()}</td>
                  <td className="text-ink-muted px-4 py-3">{timeAgo(a.publishedAt)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-3 text-xs font-bold tracking-wide uppercase">
                      <Link
                        href={`/admin/articles/${a.id}/edit`}
                        className="text-ink-muted hover:text-brand"
                      >
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
  note,
  href,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  /** Highlighted call-to-action, e.g. "3 awaiting reply". Omitted when zero. */
  note?: string;
  href?: string;
}) {
  const body = (
    <>
      <div className="text-ink-soft flex items-center gap-2">
        {icon}
        <span className="text-xs font-bold tracking-wide uppercase">{label}</span>
        {note && (
          <span className="bg-brand ml-auto rounded-full px-2 py-0.5 text-[0.65rem] leading-none font-bold text-white">
            {note}
          </span>
        )}
      </div>
      <p className="font-headline text-ink mt-2 text-3xl font-extrabold">
        {value.toLocaleString()}
      </p>
    </>
  );

  const className = note
    ? "border-brand bg-surface block rounded-xl border p-5"
    : "border-border bg-surface block rounded-xl border p-5";

  return href ? (
    <Link href={href} className={`${className} hover:border-brand transition`}>
      {body}
    </Link>
  ) : (
    <div className={className}>{body}</div>
  );
}
