import Link from "next/link";
import { Logo } from "@/components/logo";
import { SearchBox } from "@/components/search-box";
import { ThemeToggle } from "@/components/theme-toggle";
import { MobileNav } from "@/components/mobile-nav";
import { BreakingTicker } from "@/components/breaking-ticker";
import { getCategories, getBreakingHeadlines } from "@/lib/data";
import { longDate } from "@/lib/utils";

export async function SiteHeader() {
  const [categories, breaking] = await Promise.all([getCategories(), getBreakingHeadlines()]);

  return (
    <header className="border-border bg-surface/95 sticky top-0 z-40 border-b backdrop-blur">
      <div className="border-border text-ink-soft hidden items-center justify-between border-b px-4 py-1.5 text-xs sm:flex sm:px-6 lg:px-10">
        <span>{longDate(new Date())}</span>
        <div className="flex items-center gap-4">
          <Link href="/category/local" className="hover:text-brand">
            Kampala 26&deg;C
          </Link>
          <Link href="/admin" className="hover:text-brand">
            Staff Login
          </Link>
        </div>
      </div>

      <div className="flex items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-10">
        <div className="flex items-center gap-3">
          <MobileNav categories={categories} />
          <Logo tagline />
        </div>
        <div className="hidden max-w-sm flex-1 md:block">
          <SearchBox />
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link
            href="#newsletter"
            className="bg-brand font-headline hover:bg-brand-ink hidden rounded-full px-4 py-2 text-xs font-bold tracking-wide text-white uppercase transition sm:inline-block"
          >
            Subscribe
          </Link>
        </div>
      </div>

      <nav className="border-border hidden border-t px-4 sm:px-6 lg:flex lg:px-10">
        <ul className="flex items-center gap-1">
          <li>
            <Link
              href="/"
              className="font-headline text-ink hover:text-brand block px-3 py-2.5 text-sm font-bold tracking-wide uppercase"
            >
              Home
            </Link>
          </li>
          {categories.map((c) => (
            <li key={c.slug}>
              <Link
                href={`/category/${c.slug}`}
                className="font-headline text-ink hover:text-brand block px-3 py-2.5 text-sm font-bold tracking-wide uppercase"
              >
                {c.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <BreakingTicker items={breaking.map((b) => ({ slug: b.slug, title: b.title }))} />
    </header>
  );
}
