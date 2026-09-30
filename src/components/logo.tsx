import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * The wordmark is dark on a transparent background, so it disappears on dark
 * surfaces. `plate` sits it on a white chip there (always, for the admin
 * sidebar; only in dark mode elsewhere).
 */
export function Logo({
  className,
  plate = "dark",
}: {
  className?: string;
  plate?: "dark" | "always";
}) {
  return (
    <Link
      href="/"
      className={cn(
        "inline-block rounded-md leading-none",
        plate === "always" ? "bg-white px-2 py-1" : "dark:bg-white dark:px-2 dark:py-1",
      )}
    >
      <Image
        src="/logo.png"
        alt="KyabiseUG — Uganda's Voice, The World's Story"
        width={1200}
        height={387}
        priority
        className={cn("h-11 w-auto", className)}
      />
    </Link>
  );
}
