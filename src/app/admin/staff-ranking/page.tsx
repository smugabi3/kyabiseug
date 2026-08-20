import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { canAccessNewsroom, canViewAnalytics, ROLE_LABELS, type Role } from "@/lib/roles";
import { AdminShell } from "@/components/admin/admin-shell";
import { getAdminBadges } from "@/lib/notifications";
import { Trophy, FileText, Eye, MousePointerClick } from "lucide-react";

type StaffRow = {
  id: string;
  name: string;
  role: string;
  isSuperAdmin: boolean;
  articleCount: number;
  articleViews: number;
  realVisits: number;
};

const MEDALS = ["🥇", "🥈", "🥉"];

export default async function StaffRankingPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/admin/login");

  const badges = await getAdminBadges(user);
  if (!canViewAnalytics(user)) redirect("/admin");

  const [users, articles, viewsByPath] = await Promise.all([
    prisma.user.findMany({
      select: { id: true, name: true, role: true, isSuperAdmin: true },
      orderBy: { createdAt: "asc" },
    }),
    prisma.article.findMany({
      select: { slug: true, views: true, authorId: true, author: true },
    }),
    prisma.pageView.groupBy({
      by: ["path"],
      where: { path: { startsWith: "/article/" } },
      _count: { _all: true },
    }),
  ]);

  const visitsBySlug = new Map<string, number>();
  for (const row of viewsByPath) {
    visitsBySlug.set(row.path.replace("/article/", ""), row._count._all);
  }

  const staff = users.filter((u) => canAccessNewsroom(u.role));
  const staffByName = new Map(staff.map((s) => [s.name.trim().toLowerCase(), s.id]));

  const totals = new Map<
    string,
    { articleCount: number; articleViews: number; realVisits: number }
  >(staff.map((s) => [s.id, { articleCount: 0, articleViews: 0, realVisits: 0 }]));

  let unattributed = 0;
  for (const article of articles) {
    // Prefer the authoritative account link. Seeded and legacy articles predate that
    // link (or lost it when an account was removed), so fall back to matching the
    // byline against a current staff member's name — that byline is the newsroom's
    // own record of who wrote the piece.
    const ownerId =
      article.authorId ?? staffByName.get(article.author.trim().toLowerCase()) ?? null;

    if (!ownerId || !totals.has(ownerId)) {
      unattributed++;
      continue;
    }

    const bucket = totals.get(ownerId)!;
    bucket.articleCount++;
    bucket.articleViews += article.views;
    bucket.realVisits += visitsBySlug.get(article.slug) ?? 0;
  }

  const rows: StaffRow[] = staff
    .map((s) => ({ ...s, ...totals.get(s.id)! }))
    .sort((a, b) => b.articleViews - a.articleViews || b.realVisits - a.realVisits);

  const ranked = rows.filter((r) => r.articleCount > 0);
  const inactive = rows.filter((r) => r.articleCount === 0);

  return (
    <AdminShell user={user} active="staff-ranking" badges={badges}>
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-10">
        <h1 className="font-headline text-ink text-3xl font-extrabold tracking-tight uppercase">
          Staff Ranking
        </h1>
        <p className="text-ink-muted mt-1 text-sm">
          Visible only to the super admin. Ranked by total article views, with real visitor data
          alongside.
        </p>

        {ranked.length === 0 ? (
          <div className="border-border bg-surface mt-8 rounded-xl border p-8 text-center">
            <Trophy className="text-ink-soft mx-auto h-8 w-8" />
            <p className="text-ink mt-3 font-semibold">No articles are attributed to staff yet</p>
            <p className="text-ink-muted mx-auto mt-2 max-w-md text-sm">
              Articles published through the newsroom are linked to the account that created them,
              and will appear here automatically.
            </p>
          </div>
        ) : (
          <div className="border-border bg-surface mt-8 overflow-x-auto rounded-xl border">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="border-border bg-surface-alt text-ink-muted border-b text-xs font-bold tracking-wide uppercase">
                <tr>
                  <th className="px-4 py-3">Rank</th>
                  <th className="px-4 py-3">Staff Member</th>
                  <th className="px-4 py-3">Role</th>
                  <th className="px-4 py-3 text-right">Articles</th>
                  <th className="px-4 py-3 text-right">Article Views</th>
                  <th className="px-4 py-3 text-right">Visits Tracked</th>
                </tr>
              </thead>
              <tbody className="divide-border divide-y">
                {ranked.map((row, i) => (
                  <tr key={row.id}>
                    <td className="px-4 py-3">
                      <span className="font-headline text-ink text-base font-extrabold">
                        {MEDALS[i] ?? i + 1}
                      </span>
                    </td>
                    <td className="text-ink px-4 py-3 font-medium">
                      {row.name}
                      {row.id === user.id && (
                        <span className="text-ink-soft ml-2 text-xs font-bold">(you)</span>
                      )}
                    </td>
                    <td className="text-ink-muted px-4 py-3">
                      {row.isSuperAdmin
                        ? "Super Admin"
                        : (ROLE_LABELS[row.role as Role] ?? row.role)}
                    </td>
                    <td className="text-ink-muted px-4 py-3 text-right">{row.articleCount}</td>
                    <td className="text-ink px-4 py-3 text-right font-semibold">
                      {row.articleViews.toLocaleString()}
                    </td>
                    <td className="text-ink-muted px-4 py-3 text-right">
                      {row.realVisits.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {inactive.length > 0 && (
          <p className="text-ink-soft mt-4 text-xs">
            Not ranked (no articles yet): {inactive.map((r) => r.name).join(", ")}.
          </p>
        )}

        <div className="border-border bg-surface-alt mt-8 rounded-xl border p-5">
          <h2 className="text-ink mb-3 text-xs font-bold tracking-wide uppercase">
            Reading these numbers
          </h2>
          <ul className="text-ink-muted space-y-2 text-sm">
            <li className="flex gap-2">
              <Eye className="mt-0.5 h-4 w-4 shrink-0" />
              <span>
                <strong className="text-ink">Article Views</strong> — the counter incremented each
                time an article page is opened. Counted since the site launched, so this is the
                fuller history.
              </span>
            </li>
            <li className="flex gap-2">
              <MousePointerClick className="mt-0.5 h-4 w-4 shrink-0" />
              <span>
                <strong className="text-ink">Visits Tracked</strong> — visits recorded by the
                analytics system, which also knows where readers came from. It only has data from
                when analytics was added, so expect it to read lower than Article Views until it
                catches up.
              </span>
            </li>
            <li className="flex gap-2">
              <FileText className="mt-0.5 h-4 w-4 shrink-0" />
              <span>
                Articles are matched to staff by the account that published them, or by a byline
                matching a staff member&apos;s name.
                {unattributed > 0 && (
                  <>
                    {" "}
                    <strong className="text-ink">{unattributed}</strong>{" "}
                    {unattributed === 1 ? "article is" : "articles are"} not attributed to any
                    current staff account and {unattributed === 1 ? "is" : "are"} excluded from this
                    ranking.
                  </>
                )}
              </span>
            </li>
          </ul>
        </div>
      </div>
    </AdminShell>
  );
}
