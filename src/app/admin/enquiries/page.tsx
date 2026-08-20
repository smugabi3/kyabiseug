import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { canViewEnquiries } from "@/lib/roles";
import { AdminShell } from "@/components/admin/admin-shell";
import { getAdminBadges } from "@/lib/notifications";
import { toggleEnquiryHandledAction } from "@/lib/enquiry-actions";
import { longDate } from "@/lib/utils";
import { Inbox, Megaphone, Mail, Phone, Building2 } from "lucide-react";

const ADVERT_TYPE_LABELS: Record<string, string> = {
  banner: "Advertising on the site",
  "sponsored-article": "Publishing an article",
  other: "Something else",
};

export default async function EnquiriesPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/admin/login");
  if (!canViewEnquiries(user.role)) redirect("/admin");

  // Not marked as "seen" on view: this badge counts outstanding work, so it
  // should only clear when an enquiry is actually marked handled.
  const badges = await getAdminBadges(user);

  const enquiries = await prisma.enquiry.findMany({
    orderBy: [{ handled: "asc" }, { createdAt: "desc" }],
    take: 200,
  });

  const outstanding = enquiries.filter((e) => !e.handled).length;

  return (
    <AdminShell user={user} active="enquiries" badges={badges}>
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-10">
        <h1 className="font-headline text-ink text-3xl font-extrabold tracking-tight uppercase">
          Enquiries
        </h1>
        <p className="text-ink-muted mt-1 text-sm">
          Messages from the Contact and Advertise pages.{" "}
          {outstanding > 0 ? (
            <>
              <strong className="text-ink">{outstanding}</strong> awaiting a reply.
            </>
          ) : (
            "Everything here has been handled."
          )}
        </p>

        {enquiries.length === 0 ? (
          <div className="border-border bg-surface mt-8 rounded-xl border p-10 text-center">
            <Inbox className="text-ink-soft mx-auto h-8 w-8" />
            <p className="text-ink mt-3 font-semibold">No enquiries yet</p>
            <p className="text-ink-muted mt-1 text-sm">
              Submissions from the Contact and Advertise pages will appear here.
            </p>
          </div>
        ) : (
          <ul className="mt-8 space-y-4">
            {enquiries.map((e) => (
              <li
                key={e.id}
                className={
                  e.handled
                    ? "border-border bg-surface-alt rounded-xl border p-5 opacity-60"
                    : "border-border bg-surface rounded-xl border p-5"
                }
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      {e.kind === "advertise" ? (
                        <span className="bg-gold/20 text-gold-ink inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold">
                          <Megaphone className="h-3 w-3" />
                          Advertising
                        </span>
                      ) : (
                        <span className="bg-cat-tech/10 text-cat-tech inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold">
                          <Mail className="h-3 w-3" />
                          Contact
                        </span>
                      )}
                      <span className="text-ink font-semibold">{e.name}</span>
                      {e.handled && (
                        <span className="text-ink-soft text-xs font-bold uppercase">Handled</span>
                      )}
                    </div>

                    <div className="text-ink-muted mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs">
                      <a
                        href={`mailto:${e.email}`}
                        className="hover:text-brand flex items-center gap-1"
                      >
                        <Mail className="h-3 w-3" />
                        {e.email}
                      </a>
                      {e.phone && (
                        <a
                          href={`tel:${e.phone}`}
                          className="hover:text-brand flex items-center gap-1"
                        >
                          <Phone className="h-3 w-3" />
                          {e.phone}
                        </a>
                      )}
                      {e.company && (
                        <span className="flex items-center gap-1">
                          <Building2 className="h-3 w-3" />
                          {e.company}
                        </span>
                      )}
                    </div>
                  </div>

                  <form action={toggleEnquiryHandledAction.bind(null, e.id)}>
                    <button
                      type="submit"
                      className="border-border text-ink-muted hover:border-brand hover:text-brand shrink-0 rounded-full border px-3 py-1.5 text-xs font-bold tracking-wide uppercase transition"
                    >
                      {e.handled ? "Reopen" : "Mark handled"}
                    </button>
                  </form>
                </div>

                {(e.advertType || e.budget) && (
                  <div className="text-ink-muted mt-3 flex flex-wrap gap-x-5 gap-y-1 text-xs">
                    {e.advertType && (
                      <span>
                        <strong className="text-ink">Interested in:</strong>{" "}
                        {ADVERT_TYPE_LABELS[e.advertType] ?? e.advertType}
                      </span>
                    )}
                    {e.budget && (
                      <span>
                        <strong className="text-ink">Budget:</strong> {e.budget}
                      </span>
                    )}
                  </div>
                )}

                <p className="text-ink-muted mt-3 text-sm leading-relaxed whitespace-pre-wrap">
                  {e.message}
                </p>

                <p className="text-ink-soft mt-3 text-xs">{longDate(e.createdAt)}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </AdminShell>
  );
}
