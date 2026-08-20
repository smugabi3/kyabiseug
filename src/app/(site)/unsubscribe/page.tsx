import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { CheckCircle2, AlertTriangle } from "lucide-react";

export const metadata: Metadata = {
  title: "Unsubscribe",
  robots: { index: false, follow: false },
};

/**
 * One-click unsubscribe. The token in the link identifies the subscriber, so no
 * sign-in and no typing an address is needed — which is what the Privacy Policy
 * promises and what mail clients expect.
 *
 * Deliberately not `export const dynamic` cached: this both reads and writes,
 * and must reflect the removal immediately.
 */
export default async function UnsubscribePage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;

  let status: "done" | "already" | "invalid" = "invalid";
  let email: string | null = null;

  if (token) {
    const subscriber = await prisma.newsletterSubscriber.findUnique({
      where: { unsubscribeToken: token },
      select: { id: true, email: true },
    });

    if (subscriber) {
      email = subscriber.email;
      await prisma.newsletterSubscriber.delete({ where: { id: subscriber.id } });
      status = "done";
    } else {
      // A token that matches nothing usually means the link was already used —
      // treat that as success rather than alarming someone who is already off the list.
      status = "already";
    }
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-20 text-center sm:px-6">
      {status === "invalid" ? (
        <>
          <AlertTriangle className="text-gold-ink mx-auto h-10 w-10" />
          <h1 className="font-headline text-ink mt-4 text-2xl font-extrabold tracking-tight uppercase">
            Link not recognised
          </h1>
          <p className="text-ink-muted mt-3 leading-relaxed">
            This unsubscribe link looks incomplete. Please use the link at the bottom of a KyabiseUG
            newsletter, or email us at{" "}
            <a href="mailto:info@kyabiseuganda.com" className="text-brand hover:underline">
              info@kyabiseuganda.com
            </a>{" "}
            and we&apos;ll remove you.
          </p>
        </>
      ) : (
        <>
          <CheckCircle2 className="text-cat-sports mx-auto h-10 w-10" />
          <h1 className="font-headline text-ink mt-4 text-2xl font-extrabold tracking-tight uppercase">
            {status === "done" ? "You're unsubscribed" : "Already unsubscribed"}
          </h1>
          <p className="text-ink-muted mt-3 leading-relaxed">
            {status === "done" ? (
              <>
                {email ? <strong className="text-ink">{email}</strong> : "That address"} has been
                removed from the KyabiseUG newsletter. You won&apos;t receive any further issues.
              </>
            ) : (
              "That address is no longer on the KyabiseUG newsletter list."
            )}
          </p>
        </>
      )}

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/"
          className="bg-brand font-headline hover:bg-brand-ink rounded-full px-6 py-3 text-sm font-bold tracking-wide text-white uppercase transition"
        >
          Back to KyabiseUG
        </Link>
        <Link
          href="/contact"
          className="border-border font-headline text-ink-muted hover:border-brand hover:text-brand rounded-full border px-6 py-3 text-sm font-bold tracking-wide uppercase transition"
        >
          Contact us
        </Link>
      </div>
    </div>
  );
}
