import Link from "next/link";
import { Logo } from "@/components/logo";
import { NewsletterForm } from "@/components/newsletter-form";
import { getCategories } from "@/lib/data";
import { SocialIcon, type SocialPlatform } from "@/components/social-icon";

const SOCIALS: SocialPlatform[] = ["facebook", "twitter", "instagram", "youtube"];

export async function SiteFooter() {
  const categories = await getCategories();

  return (
    <footer className="border-t border-border bg-surface-alt">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.3fr_1fr_1fr_1.2fr] lg:px-10">
        <div>
          <Logo tagline />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-ink-muted">
            KyabiseUG is Uganda&apos;s independent home for local and international news,
            sports, health, technology, gospel and entertainment — reported with accuracy
            and delivered around the clock.
          </p>
          <div className="mt-5 flex items-center gap-3">
            {SOCIALS.map((platform) => (
              <a
                key={platform}
                href="#"
                aria-label={platform}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-ink-muted transition hover:border-brand hover:text-brand"
              >
                <SocialIcon platform={platform} className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-headline text-sm font-bold uppercase tracking-wide text-ink">
            Sections
          </h4>
          <ul className="mt-4 space-y-2.5 text-sm text-ink-muted">
            {categories.map((c) => (
              <li key={c.slug}>
                <Link href={`/category/${c.slug}`} className="hover:text-brand">
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-headline text-sm font-bold uppercase tracking-wide text-ink">
            Company
          </h4>
          <ul className="mt-4 space-y-2.5 text-sm text-ink-muted">
            <li>
              <Link href="/about" className="hover:text-brand">
                About KyabiseUG
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-brand">
                Contact Us
              </Link>
            </li>
            <li>
              <Link href="/advertise" className="hover:text-brand">
                Advertise
              </Link>
            </li>
            <li>
              <Link href="/admin" className="hover:text-brand">
                Staff Login
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-headline text-sm font-bold uppercase tracking-wide text-ink">
            Stay Informed
          </h4>
          <p className="mt-4 text-sm text-ink-muted">
            Get our top stories in your inbox every morning.
          </p>
          <div className="mt-3">
            <NewsletterForm />
          </div>
        </div>
      </div>

      <div className="border-t border-border px-4 py-5 sm:px-6 lg:px-10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 text-xs text-ink-soft sm:flex-row">
          <p>&copy; {new Date().getFullYear()} KyabiseUG. All rights reserved.</p>
          <p>Made in Kampala, Uganda.</p>
        </div>
      </div>
    </footer>
  );
}
