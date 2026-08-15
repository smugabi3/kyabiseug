import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { canViewSubscribers } from "@/lib/roles";
import { AdminShell } from "@/components/admin/admin-shell";
import { isMailchimpConfigured } from "@/lib/mailchimp";
import { longDate } from "@/lib/utils";
import { Mail, CheckCircle2, AlertTriangle } from "lucide-react";

export default async function SubscribersPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/admin/login");
  if (!canViewSubscribers(user.role)) redirect("/admin");

  const subscribers = await prisma.newsletterSubscriber.findMany({
    orderBy: { createdAt: "desc" },
  });
  const mailchimpOn = isMailchimpConfigured();

  return (
    <AdminShell user={user} active="subscribers">
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="font-headline text-3xl font-extrabold uppercase tracking-tight text-ink">
              Newsletter Subscribers
            </h1>
            <p className="mt-1 text-sm text-ink-muted">
              {subscribers.length.toLocaleString()} {subscribers.length === 1 ? "person has" : "people have"} signed up
              for the KyabiseUG newsletter.
            </p>
          </div>
          {mailchimpOn ? (
            <span className="flex items-center gap-1.5 rounded-full bg-cat-sports/10 px-3 py-1.5 text-xs font-bold text-cat-sports">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Synced to Mailchimp
            </span>
          ) : (
            <span className="flex items-center gap-1.5 rounded-full bg-gold/20 px-3 py-1.5 text-xs font-bold text-gold-ink">
              <AlertTriangle className="h-3.5 w-3.5" />
              Mailchimp not connected
            </span>
          )}
        </div>

        <div className="mt-8 overflow-x-auto rounded-xl border border-border bg-surface">
          <table className="w-full min-w-[420px] text-left text-sm">
            <thead className="border-b border-border bg-surface-alt text-xs font-bold uppercase tracking-wide text-ink-muted">
              <tr>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Subscribed</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {subscribers.length === 0 && (
                <tr>
                  <td colSpan={2} className="px-4 py-10 text-center text-ink-muted">
                    No subscribers yet.
                  </td>
                </tr>
              )}
              {subscribers.map((s) => (
                <tr key={s.id}>
                  <td className="flex items-center gap-2 px-4 py-3 font-medium text-ink">
                    <Mail className="h-3.5 w-3.5 text-ink-soft" />
                    {s.email}
                  </td>
                  <td className="px-4 py-3 text-ink-muted">{longDate(s.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminShell>
  );
}
