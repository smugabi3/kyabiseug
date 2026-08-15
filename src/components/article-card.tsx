import Image from "next/image";
import Link from "next/link";
import { CategoryBadge } from "@/components/category-badge";
import { timeAgo, cn } from "@/lib/utils";
import { Play } from "lucide-react";

type CardArticle = {
  slug: string;
  title: string;
  dek: string;
  coverImage: string;
  publishedAt: Date | string;
  isVideo: boolean;
  category: { slug: string; name: string };
};

export function ArticleCard({
  article,
  variant = "vertical",
  showDek = true,
  imageSizes = "(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw",
}: {
  article: CardArticle;
  variant?: "vertical" | "horizontal" | "compact";
  showDek?: boolean;
  imageSizes?: string;
}) {
  const href = `/article/${article.slug}`;

  if (variant === "compact") {
    return (
      <div className="group flex gap-3">
        <Link href={href} className="relative h-16 w-24 shrink-0 overflow-hidden rounded-md bg-surface-alt">
          <Image
            src={article.coverImage}
            alt=""
            fill
            sizes="96px"
            className="object-cover transition duration-300 group-hover:scale-105"
          />
        </Link>
        <div className="min-w-0">
          <CategoryBadge slug={article.category.slug} name={article.category.name} size="sm" />
          <Link href={href}>
            <h3 className="mt-1 line-clamp-2 font-headline text-sm font-bold leading-snug text-ink group-hover:text-brand">
              {article.title}
            </h3>
          </Link>
        </div>
      </div>
    );
  }

  if (variant === "horizontal") {
    return (
      <div className="group flex gap-4 sm:gap-5">
        <Link
          href={href}
          className="relative aspect-[4/3] w-32 shrink-0 overflow-hidden rounded-lg bg-surface-alt sm:w-48"
        >
          <Image
            src={article.coverImage}
            alt=""
            fill
            sizes={imageSizes}
            className="object-cover transition duration-300 group-hover:scale-105"
          />
          {article.isVideo && <VideoBadge />}
        </Link>
        <div className="min-w-0 flex-1">
          <CategoryBadge slug={article.category.slug} name={article.category.name} />
          <Link href={href}>
            <h3 className="mt-1.5 line-clamp-2 font-headline text-lg font-bold leading-tight text-ink group-hover:text-brand sm:text-xl">
              {article.title}
            </h3>
          </Link>
          {showDek && (
            <p className="mt-1.5 hidden line-clamp-2 text-sm text-ink-muted sm:block">
              {article.dek}
            </p>
          )}
          <p className="mt-2 text-xs text-ink-soft">{timeAgo(article.publishedAt)}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="group block">
      <Link href={href} className="relative block aspect-[4/3] overflow-hidden rounded-lg bg-surface-alt">
        <Image
          src={article.coverImage}
          alt=""
          fill
          sizes={imageSizes}
          className="object-cover transition duration-300 group-hover:scale-105"
        />
        {article.isVideo && <VideoBadge />}
      </Link>
      <div className="mt-3">
        <CategoryBadge slug={article.category.slug} name={article.category.name} />
        <Link href={href}>
          <h3 className="mt-1.5 line-clamp-2 font-headline text-lg font-bold leading-tight text-ink group-hover:text-brand">
            {article.title}
          </h3>
        </Link>
        {showDek && (
          <p className="mt-1.5 line-clamp-2 text-sm text-ink-muted">{article.dek}</p>
        )}
        <p className="mt-2 text-xs text-ink-soft">{timeAgo(article.publishedAt)}</p>
      </div>
    </div>
  );
}

function VideoBadge() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black/10">
      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-brand shadow-lg">
        <Play className="ml-0.5 h-4 w-4 fill-current" />
      </span>
    </div>
  );
}

export function cardGridCols(n: number) {
  return cn(
    "grid gap-6",
    n >= 4 && "sm:grid-cols-2 lg:grid-cols-4",
    n === 3 && "sm:grid-cols-3",
    n === 2 && "sm:grid-cols-2"
  );
}
