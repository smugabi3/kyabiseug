import Link from "next/link";
import { categoryColor } from "@/lib/categories";
import { cn } from "@/lib/utils";

export function CategoryBadge({
  slug,
  name,
  size = "sm",
  className,
}: {
  slug: string;
  name: string;
  size?: "sm" | "md";
  className?: string;
}) {
  return (
    <Link
      href={`/category/${slug}`}
      style={{ color: categoryColor(slug) }}
      className={cn(
        "inline-flex items-center gap-1 font-headline font-bold uppercase tracking-wider hover:underline",
        size === "sm" ? "text-[0.7rem]" : "text-xs",
        className
      )}
    >
      <span
        className="h-1.5 w-1.5 rounded-full"
        style={{ backgroundColor: categoryColor(slug) }}
      />
      {name}
    </Link>
  );
}
