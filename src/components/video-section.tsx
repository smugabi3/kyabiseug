import Image from "next/image";
import Link from "next/link";
import { Play } from "lucide-react";
import { CategoryBadge } from "@/components/category-badge";
import { timeAgo } from "@/lib/utils";

type VideoArticle = {
  slug: string;
  title: string;
  dek: string;
  coverImage: string;
  publishedAt: Date | string;
  category: { slug: string; name: string };
};

export function VideoSection({ items }: { items: VideoArticle[] }) {
  if (items.length === 0) return null;
  const [main, ...rest] = items;

  return (
    <section className="bg-ink-static rounded-xl px-5 py-8 text-white sm:px-8">
      <div className="mb-6 flex items-center gap-2 border-b-2 border-white/20 pb-2.5">
        <span className="bg-brand flex h-6 w-6 items-center justify-center rounded-full">
          <Play className="ml-0.5 h-3 w-3 fill-current text-white" />
        </span>
        <h2 className="font-headline text-xl font-extrabold tracking-tight uppercase sm:text-2xl">
          Watch &amp; Live
        </h2>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Link href={`/article/${main.slug}`} className="group lg:col-span-2">
          <div className="relative aspect-video overflow-hidden rounded-lg bg-white/10">
            <Image
              src={main.coverImage}
              alt=""
              fill
              sizes="(min-width: 1024px) 66vw, 100vw"
              className="object-cover transition duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/20">
              <span className="bg-brand flex h-14 w-14 items-center justify-center rounded-full shadow-lg transition group-hover:scale-110">
                <Play className="ml-1 h-5 w-5 fill-current text-white" />
              </span>
            </div>
          </div>
          <h3 className="font-headline group-hover:text-gold mt-3 text-xl leading-tight font-bold sm:text-2xl">
            {main.title}
          </h3>
          <p className="mt-1.5 line-clamp-2 text-sm text-white/70">{main.dek}</p>
        </Link>

        <div className="flex flex-col gap-4">
          {rest.slice(0, 3).map((item) => (
            <div key={item.slug} className="group flex gap-3">
              <Link
                href={`/article/${item.slug}`}
                className="relative aspect-video w-28 shrink-0 overflow-hidden rounded-md bg-white/10 sm:w-32"
              >
                <Image src={item.coverImage} alt="" fill sizes="128px" className="object-cover" />
                <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                  <Play className="h-4 w-4 fill-current text-white" />
                </div>
              </Link>
              <div className="min-w-0">
                <CategoryBadge slug={item.category.slug} name={item.category.name} />
                <Link href={`/article/${item.slug}`}>
                  <h4 className="font-headline group-hover:text-gold mt-1 line-clamp-2 text-sm leading-snug font-bold">
                    {item.title}
                  </h4>
                </Link>
                <p className="mt-1 text-xs text-white/50">{timeAgo(item.publishedAt)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
