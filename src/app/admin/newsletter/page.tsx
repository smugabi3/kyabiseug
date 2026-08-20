import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { canSendNewsletter } from "@/lib/roles";
import { AdminShell } from "@/components/admin/admin-shell";
import { getAdminBadges } from "@/lib/notifications";
import { NewsletterComposer } from "@/components/admin/newsletter-composer";
import { isEmailConfigured } from "@/lib/email";
import { longDate } from "@/lib/utils";

export default async function NewsletterPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/admin/login");
  if (!canSendNewsletter(user.role)) redirect("/admin");

  const badges = await getAdminBadges(user);

  const [subscribers, past] = await Promise.all([
    prisma.newsletterSubscriber.findMany({ select: { email: true } }),
    prisma.newsletter.findMany({ orderBy: { sentAt: "desc" }, take: 10 }),
  ]);

  // Counted the same way the send action does, so the number on the button is
  // the number of emails that will actually go out.
  const uniqueCount = new Set(subscribers.map((s) => s.email.trim().toLowerCase())).size;

  return (
    <AdminShell user={user} active="newsletter" badges={badges}>
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-10">
        <h1 className="font-headline text-ink text-3xl font-extrabold tracking-tight uppercase">
          Send Newsletter
        </h1>
        <p className="text-ink-muted mt-1 text-sm">
          Compose an issue and send it to everyone on the subscriber list. Each person receives
          their own copy, so addresses are never shared between recipients.
        </p>

        <div className="mt-8">
          <NewsletterComposer subscriberCount={uniqueCount} emailConfigured={isEmailConfigured()} />
        </div>

        {past.length > 0 && (
          <section className="border-border mt-14 border-t pt-8">
            <h2 className="font-headline text-ink mb-4 text-sm font-bold tracking-wide uppercase">
              Previously sent
            </h2>
            <ul className="border-border bg-surface divide-border divide-y overflow-hidden rounded-xl border">
              {past.map((n) => (
                <li key={n.id} className="flex flex-wrap items-center gap-3 px-4 py-3">
                  <span className="text-ink min-w-0 flex-1 truncate text-sm font-medium">
                    {n.subject}
                  </span>
                  <span className="text-ink-muted shrink-0 text-xs">
                    {n.recipientCount} sent
                    {n.failedCount > 0 && (
                      <span className="text-brand"> · {n.failedCount} failed</span>
                    )}
                  </span>
                  <span className="text-ink-soft hidden shrink-0 text-xs sm:block">
                    {longDate(n.sentAt)}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </AdminShell>
  );
}
