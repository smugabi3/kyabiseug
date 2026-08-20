import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { canViewSubscribers } from "@/lib/roles";
import { AdminShell } from "@/components/admin/admin-shell";
import { getAdminBadges, markSectionSeen } from "@/lib/notifications";
import { isMailchimpConfigured } from "@/lib/mailchimp";
import { longDate } from "@/lib/utils";
import { Mail, CheckCircle2, AlertTriangle } from "lucide-react";

export default async function SubscribersPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/admin/login");
  if (!canViewSubscribers(user.role)) redirect("/admin");

  // Read the badge count and the newest-first cutoff *before* stamping the page
  // as seen, otherwise opening it would clear the very thing it's meant to show.
  const badges = await getAdminBadges(user);
  const newSince = badges.newSubscribers;

  const subscribers = await prisma.newsletterSubscriber.findMany({
    orderBy: { createdAt: "desc" },
  });
  const mailchimpOn = isMailchimpConfigured();

  await markSectionSeen(user.id, "subscribers");

  return (
    <AdminShell user={user} active="subscribers" badges={badges}>
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="font-headline text-ink text-3xl font-extrabold tracking-tight uppercase">
              Newsletter Subscribers
            </h1>
            <p className="text-ink-muted mt-1 text-sm">
              {subscribers.length.toLocaleString()}{" "}
              {subscribers.length === 1 ? "person has" : "people have"} signed up for the KyabiseUG
              newsletter.
              {newSince > 0 && (
                <>
                  {" "}
                  <strong className="text-brand">{newSince} new since you last looked.</strong>
                </>
              )}
            </p>
          </div>
          {mailchimpOn ? (
            <span className="bg-cat-sports/10 text-cat-sports flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Synced to Mailchimp
            </span>
          ) : (
            <span className="bg-gold/20 text-gold-ink flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold">
              <AlertTriangle className="h-3.5 w-3.5" />
              Mailchimp not connected
            </span>
          )}
        </div>

        <div className="border-border bg-surface mt-8 overflow-x-auto rounded-xl border">
          <table className="w-full min-w-[420px] text-left text-sm">
            <thead className="border-border bg-surface-alt text-ink-muted border-b text-xs font-bold tracking-wide uppercase">
              <tr>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Subscribed</th>
              </tr>
            </thead>
            <tbody className="divide-border divide-y">
              {subscribers.length === 0 && (
                <tr>
                  <td colSpan={2} className="text-ink-muted px-4 py-10 text-center">
                    No subscribers yet.
                  </td>
                </tr>
              )}
              {/* Newest first, so the first `newSince` rows are exactly the ones
                  that arrived since this admin last opened the page. */}
              {subscribers.map((s, i) => (
                <tr key={s.id}>
                  <td className="text-ink flex items-center gap-2 px-4 py-3 font-medium">
                    <Mail className="text-ink-soft h-3.5 w-3.5" />
                    {s.email}
                    {i < newSince && (
                      <span className="bg-brand rounded-full px-2 py-0.5 text-[0.6rem] font-bold text-white uppercase">
                        New
                      </span>
                    )}
                  </td>
                  <td className="text-ink-muted px-4 py-3">{longDate(s.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminShell>
  );
}
