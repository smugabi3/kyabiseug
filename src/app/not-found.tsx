import Link from "next/link";
import { Logo } from "@/components/logo";

/**
 * Root 404, shown for unmatched URLs and for any `notFound()` thrown in a route.
 *
 * Deliberately self-contained: it renders no header or footer, because those are
 * async server components that query the database. A 404 page that depends on the
 * database would turn every missing page into a 500 whenever the database is
 * unreachable — exactly when you most want a page that still renders.
 */
export default function NotFound() {
  return (
    <div className="bg-surface flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <Logo />

      <p className="font-headline text-brand mt-10 text-6xl font-black tracking-tight sm:text-7xl">
        404
      </p>
      <h1 className="font-headline text-ink mt-3 text-2xl font-extrabold tracking-tight uppercase sm:text-3xl">
        Page Not Found
      </h1>
      <p className="text-ink-muted mt-3 max-w-md text-base leading-relaxed">
        The story you&apos;re looking for may have been moved, renamed, or is no longer available.
      </p>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/"
          className="bg-brand font-headline hover:bg-brand-ink rounded-full px-6 py-3 text-sm font-bold tracking-wide text-white uppercase transition"
        >
          Back to Home
        </Link>
        <Link
          href="/search"
          className="border-border font-headline text-ink-muted hover:border-brand hover:text-brand rounded-full border px-6 py-3 text-sm font-bold tracking-wide uppercase transition"
        >
          Search the site
        </Link>
      </div>
    </div>
  );
}
