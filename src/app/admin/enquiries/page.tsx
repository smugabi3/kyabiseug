import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { canViewEnquiries } from "@/lib/roles";
import { AdminShell } from "@/components/admin/admin-shell";
import { getAdminBadges } from "@/lib/notifications";
import { toggleEnquiryHandledAction } from "@/lib/enquiry-actions";
import { longDate, timeAgo } from "@/lib/utils";
import { Inbox, Megaphone, Mail, Phone, Building2, ChevronDown } from "lucide-react";

const ADVERT_TYPE_LABELS: Record<string, string> = {
  banner: "Advertising on the site",
  "sponsored-article": "Publishing an article",
  other: "Something else",
};

const SNIPPET_LENGTH = 100;

/** Collapses whitespace and newlines so a multi-paragraph message still previews on one line. */
function snippet(message: string) {
  const flat = message.replace(/\s+/g, " ").trim();
  return flat.length > SNIPPET_LENGTH ? `${flat.slice(0, SNIPPET_LENGTH).trimEnd()}…` : flat;
}

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
              <strong className="text-ink">{outstanding}</strong> awaiting a reply. Click any
              message to open it.
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
          <ul className="border-border bg-surface divide-border mt-8 divide-y overflow-hidden rounded-xl border">
            {enquiries.map((e) => (
              <li key={e.id}>
                {/* Native <details> gives click-to-open and keyboard support with no
                    client-side JavaScript, which keeps this a Server Component. */}
                <details className="group">
                  <summary
                    className={
                      "hover:bg-surface-alt flex cursor-pointer list-none items-center gap-3 px-4 py-3 transition [&::-webkit-details-marker]:hidden " +
                      (e.handled ? "opacity-60" : "")
                    }
                  >
                    {/* Unread-style dot: solid while outstanding, hollow once handled. */}
                    <span
                      aria-hidden="true"
                      className={
                        e.handled
                          ? "border-ink-soft/40 h-2 w-2 shrink-0 rounded-full border"
                          : "bg-brand h-2 w-2 shrink-0 rounded-full"
                      }
                    />

                    {e.kind === "advertise" ? (
                      <Megaphone className="text-gold-ink h-3.5 w-3.5 shrink-0" />
                    ) : (
                      <Mail className="text-cat-tech h-3.5 w-3.5 shrink-0" />
                    )}

                    <span
                      className={
                        "w-32 shrink-0 truncate text-sm sm:w-40 " +
                        (e.handled ? "text-ink-muted" : "text-ink font-semibold")
                      }
                    >
                      {e.name}
                    </span>

                    <span className="text-ink-muted min-w-0 flex-1 truncate text-sm">
                      {snippet(e.message)}
                    </span>

                    <span className="text-ink-soft hidden shrink-0 text-xs sm:block">
                      {timeAgo(e.createdAt)}
                    </span>

                    <ChevronDown className="text-ink-soft h-4 w-4 shrink-0 transition group-open:rotate-180" />
                  </summary>

                  <div className="border-border bg-surface-alt border-t px-4 py-4">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="text-ink-muted flex flex-wrap gap-x-4 gap-y-1 text-xs">
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

                      <form action={toggleEnquiryHandledAction.bind(null, e.id)}>
                        <button
                          type="submit"
                          className={
                            e.handled
                              ? "border-border text-ink-muted hover:border-brand hover:text-brand shrink-0 rounded-full border px-3 py-1.5 text-xs font-bold tracking-wide uppercase transition"
                              : "bg-brand hover:bg-brand-ink shrink-0 rounded-full px-3 py-1.5 text-xs font-bold tracking-wide text-white uppercase transition"
                          }
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

                    <p className="text-ink mt-4 text-sm leading-relaxed whitespace-pre-wrap">
                      {e.message}
                    </p>

                    <p className="text-ink-soft mt-4 text-xs">{longDate(e.createdAt)}</p>
                  </div>
                </details>
              </li>
            ))}
          </ul>
        )}
      </div>
    </AdminShell>
  );
}
