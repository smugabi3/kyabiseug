import type { Metadata } from "next";
import Link from "next/link";
import { CATEGORY_DEFS } from "@/lib/categories";
import { recordPageView } from "@/lib/analytics";
import { ShieldCheck, Scale, Users, Zap } from "lucide-react";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "KyabiseUG is an independent Ugandan news publication committed to accurate, unbiased reporting — from Kampala to the wider world.",
};

const VALUES = [
  {
    icon: ShieldCheck,
    title: "Accuracy first",
    body: "We verify before we publish. Where a fact cannot be confirmed, we say so plainly rather than filling the gap with speculation. When we get something wrong, we correct it openly instead of quietly deleting it.",
  },
  {
    icon: Scale,
    title: "Independent and unbiased",
    body: "Our reporting is not shaped by political allegiance, advertisers, or personal interest. We report what happened and let readers reach their own conclusions. Where a story involves a party we have a relationship with, we disclose it.",
  },
  {
    icon: Users,
    title: "Written for readers",
    body: "We exist to inform the people who read us — not to chase outrage for clicks. Headlines reflect the story beneath them, and context is included even when it complicates a simple narrative.",
  },
  {
    icon: Zap,
    title: "Timely, but never rushed",
    body: "News moves quickly and so do we, but speed never outranks getting it right. A story published an hour later is far better than one published wrong.",
  },
];

export default async function AboutPage() {
  await recordPageView("/about");

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="font-headline text-ink text-3xl font-extrabold tracking-tight uppercase sm:text-4xl">
        About KyabiseUG
      </h1>
      <p className="text-ink-muted mt-4 text-lg leading-relaxed">
        Uganda&apos;s voice, the world&apos;s story — independent journalism dedicated to keeping
        our readers genuinely informed.
      </p>

      <div className="mt-10 space-y-4 text-[0.95rem] leading-relaxed">
        <p className="text-ink-muted">
          KyabiseUG is an independent news publication reporting from Uganda for readers at home and
          abroad. We were built on a straightforward conviction: that people make better decisions
          when they have access to news that is true, complete, and free of an agenda.
        </p>
        <p className="text-ink-muted">
          Too much of what circulates today is rumour dressed as reporting, or reporting bent to
          serve someone&apos;s interest. We take the opposite approach. Every story we publish is
          checked before it goes out, attributed where it should be, and written to inform rather
          than to persuade. We do not publish what we cannot stand behind.
        </p>
        <p className="text-ink-muted">
          Our commitment is to our readers. Whether you are following a policy debate in Kampala,
          tracking the Cranes, or keeping up with markets, technology, health or faith, you should
          be able to read KyabiseUG and trust that what you are reading is accurate.
        </p>
      </div>

      <section className="mt-14">
        <h2 className="font-headline text-ink mb-6 text-xl font-extrabold tracking-tight uppercase">
          What we stand for
        </h2>
        <div className="grid gap-5 sm:grid-cols-2">
          {VALUES.map(({ icon: Icon, title, body }) => (
            <div key={title} className="border-border bg-surface-alt rounded-xl border p-5">
              <Icon className="text-brand h-5 w-5" />
              <h3 className="font-headline text-ink mt-3 text-base font-bold">{title}</h3>
              <p className="text-ink-muted mt-2 text-sm leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-14">
        <h2 className="font-headline text-ink mb-4 text-xl font-extrabold tracking-tight uppercase">
          What we cover
        </h2>
        <p className="text-ink-muted text-[0.95rem] leading-relaxed">
          Our newsroom reports across the subjects that shape daily life in Uganda and beyond:
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          {CATEGORY_DEFS.map((c) => (
            <Link
              key={c.slug}
              href={`/category/${c.slug}`}
              className="border-border hover:border-brand rounded-full border px-4 py-2 text-sm font-semibold transition"
              style={{ color: c.color }}
            >
              {c.name}
            </Link>
          ))}
        </div>
      </section>

      <section className="border-border mt-14 border-t pt-8">
        <h2 className="font-headline text-ink mb-3 text-xl font-extrabold tracking-tight uppercase">
          Get in touch
        </h2>
        <p className="text-ink-muted text-[0.95rem] leading-relaxed">
          Have a story, a correction, or a question? We want to hear from you.{" "}
          <Link href="/contact" className="text-brand hover:underline">
            Contact our newsroom
          </Link>
          . If you represent a business looking to reach our readers, see{" "}
          <Link href="/advertise" className="text-brand hover:underline">
            advertising and partnerships
          </Link>
          .
        </p>
      </section>
    </div>
  );
}
