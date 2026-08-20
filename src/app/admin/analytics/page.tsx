import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { canViewAnalytics } from "@/lib/roles";
import { AdminShell } from "@/components/admin/admin-shell";
import { getAdminBadges } from "@/lib/notifications";
import { SOURCE_LABELS, type TrafficSource } from "@/lib/analytics";
import { Eye, Globe2, MapPin } from "lucide-react";

const DAY_MS = 24 * 60 * 60 * 1000;
const TREND_DAYS = 14;

function countryName(code: string | null): string {
  if (!code) return "Unknown";
  try {
    return new Intl.DisplayNames(["en"], { type: "region" }).of(code) ?? code;
  } catch {
    return code;
  }
}

function countryFlag(code: string | null): string {
  if (!code || !/^[A-Z]{2}$/.test(code)) return "🌐";
  return String.fromCodePoint(...[...code].map((c) => 127397 + c.charCodeAt(0)));
}

export default async function AnalyticsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/admin/login");

  const badges = await getAdminBadges(user);
  if (!canViewAnalytics(user)) redirect("/admin");

  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * DAY_MS);
  const thirtyDaysAgo = new Date(now.getTime() - 30 * DAY_MS);
  const trendStart = new Date(now.getTime() - (TREND_DAYS - 1) * DAY_MS);

  const [totalViews, last7Views, last30Views, byCountry, bySource, byPath, trendRows] =
    await Promise.all([
      prisma.pageView.count(),
      prisma.pageView.count({ where: { createdAt: { gte: sevenDaysAgo } } }),
      prisma.pageView.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
      prisma.pageView.groupBy({
        by: ["country"],
        _count: { _all: true },
        orderBy: { _count: { country: "desc" } },
        take: 8,
      }),
      prisma.pageView.groupBy({
        by: ["source"],
        _count: { _all: true },
        orderBy: { _count: { source: "desc" } },
      }),
      prisma.pageView.groupBy({
        by: ["path"],
        _count: { _all: true },
        orderBy: { _count: { path: "desc" } },
        take: 8,
      }),
      prisma.pageView.findMany({
        where: { createdAt: { gte: trendStart } },
        select: { createdAt: true },
      }),
    ]);

  const dayBuckets = new Map<string, number>();
  for (let i = 0; i < TREND_DAYS; i++) {
    const d = new Date(trendStart.getTime() + i * DAY_MS);
    dayBuckets.set(d.toISOString().slice(0, 10), 0);
  }
  for (const row of trendRows) {
    const key = row.createdAt.toISOString().slice(0, 10);
    if (dayBuckets.has(key)) dayBuckets.set(key, (dayBuckets.get(key) ?? 0) + 1);
  }
  const trend = Array.from(dayBuckets.entries());
  const maxDay = Math.max(1, ...trend.map(([, count]) => count));

  const countryTotal = byCountry.reduce((sum, c) => sum + c._count._all, 0) || 1;
  const sourceTotal = bySource.reduce((sum, s) => sum + s._count._all, 0) || 1;

  return (
    <AdminShell user={user} active="analytics" badges={badges}>
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-10">
        <h1 className="font-headline text-ink text-3xl font-extrabold tracking-tight uppercase">
          Site Analytics
        </h1>
        <p className="text-ink-muted mt-1 text-sm">
          Visible only to the super admin. Page views across the public site — the newsroom
          dashboard itself isn&apos;t tracked.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <StatCard
            icon={<Eye className="h-4 w-4" />}
            label="Total Page Views"
            value={totalViews}
          />
          <StatCard icon={<Eye className="h-4 w-4" />} label="Last 7 Days" value={last7Views} />
          <StatCard icon={<Eye className="h-4 w-4" />} label="Last 30 Days" value={last30Views} />
        </div>

        <section className="border-border bg-surface mt-8 rounded-xl border p-5">
          <h2 className="font-headline text-ink mb-4 text-sm font-bold tracking-wide uppercase">
            Views, Last {TREND_DAYS} Days
          </h2>
          {totalViews === 0 ? (
            <p className="text-ink-muted text-sm">
              No visits recorded yet — this fills in as people visit the site.
            </p>
          ) : (
            <div className="flex h-32 items-end gap-1.5">
              {trend.map(([date, count]) => (
                // h-full (not the flex item's default content-based height) is what lets
                // the bar's percentage height below actually resolve against something —
                // a percentage height on a flex item is invalid against an auto-sized
                // parent, so without this every bar silently collapsed to 0.
                <div
                  key={date}
                  className="flex h-full flex-1 flex-col items-center justify-end gap-1.5"
                  title={`${date}: ${count} view${count === 1 ? "" : "s"}`}
                >
                  <div
                    className="bg-brand w-full rounded-t transition-all"
                    style={{ height: `${Math.max(3, (count / maxDay) * 85)}%` }}
                  />
                  <span className="text-ink-soft hidden shrink-0 text-[0.6rem] sm:block">
                    {date.slice(5)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <section className="border-border bg-surface rounded-xl border p-5">
            <h2 className="text-ink mb-4 flex items-center gap-2 text-sm font-bold tracking-wide uppercase">
              <MapPin className="h-4 w-4" />
              Top Locations
            </h2>
            {byCountry.length === 0 ? (
              <p className="text-ink-muted text-sm">No location data yet.</p>
            ) : (
              <ul className="space-y-3">
                {byCountry.map((c) => {
                  const pct = Math.round((c._count._all / countryTotal) * 100);
                  return (
                    <li key={c.country ?? "unknown"}>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-ink flex items-center gap-2">
                          <span>{countryFlag(c.country)}</span>
                          {countryName(c.country)}
                        </span>
                        <span className="text-ink-muted">
                          {c._count._all.toLocaleString()} ({pct}%)
                        </span>
                      </div>
                      <div className="bg-surface-alt mt-1 h-1.5 overflow-hidden rounded-full">
                        <div
                          className="bg-brand h-full rounded-full"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>

          <section className="border-border bg-surface rounded-xl border p-5">
            <h2 className="text-ink mb-4 flex items-center gap-2 text-sm font-bold tracking-wide uppercase">
              <Globe2 className="h-4 w-4" />
              Traffic Sources
            </h2>
            {bySource.length === 0 ? (
              <p className="text-ink-muted text-sm">No traffic data yet.</p>
            ) : (
              <ul className="space-y-3">
                {bySource.map((s) => {
                  const pct = Math.round((s._count._all / sourceTotal) * 100);
                  const key = s.source as TrafficSource;
                  return (
                    <li key={s.source}>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-ink">{SOURCE_LABELS[key] ?? s.source}</span>
                        <span className="text-ink-muted">
                          {s._count._all.toLocaleString()} ({pct}%)
                        </span>
                      </div>
                      <div className="bg-surface-alt mt-1 h-1.5 overflow-hidden rounded-full">
                        <div
                          className="bg-cat-tech h-full rounded-full"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>
        </div>

        <section className="border-border bg-surface mt-8 rounded-xl border p-5">
          <h2 className="font-headline text-ink mb-4 text-sm font-bold tracking-wide uppercase">
            Most Visited Pages
          </h2>
          {byPath.length === 0 ? (
            <p className="text-ink-muted text-sm">No page data yet.</p>
          ) : (
            <table className="w-full text-left text-sm">
              <tbody className="divide-border divide-y">
                {byPath.map((p) => (
                  <tr key={p.path}>
                    <td className="text-ink py-2 font-mono text-xs">{p.path}</td>
                    <td className="text-ink-muted py-2 text-right">
                      {p._count._all.toLocaleString()} views
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      </div>
    </AdminShell>
  );
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) {
  return (
    <div className="border-border bg-surface rounded-xl border p-5">
      <div className="text-ink-soft flex items-center gap-2">
        {icon}
        <span className="text-xs font-bold tracking-wide uppercase">{label}</span>
      </div>
      <p className="font-headline text-ink mt-2 text-3xl font-extrabold">
        {value.toLocaleString()}
      </p>
    </div>
  );
}
