import { headers } from "next/headers";
import { after } from "next/server";
import { geolocation } from "@vercel/functions";
import { prisma } from "@/lib/prisma";

const SEARCH_ENGINES = [
  "google.",
  "bing.",
  "duckduckgo.",
  "yahoo.",
  "baidu.",
  "yandex.",
  "ecosia.",
];
const SOCIAL_PLATFORMS = [
  "facebook.",
  "instagram.",
  "twitter.",
  "x.com",
  "t.co",
  "linkedin.",
  "whatsapp.",
  "tiktok.",
  "reddit.",
  "threads.",
];

export type TrafficSource = "direct" | "internal" | "search" | "social" | "other";

export const SOURCE_LABELS: Record<TrafficSource, string> = {
  direct: "Direct",
  internal: "Internal navigation",
  search: "Search engines",
  social: "Social media",
  other: "Other websites",
};

function classifySource(referrerHost: string | null, ownHost: string | null): TrafficSource {
  if (!referrerHost) return "direct";
  if (ownHost && referrerHost === ownHost) return "internal";
  if (SEARCH_ENGINES.some((s) => referrerHost.includes(s))) return "search";
  if (SOCIAL_PLATFORMS.some((s) => referrerHost.includes(s))) return "social";
  return "other";
}

/**
 * Records a page view for analytics, without slowing down the response the visitor
 * is waiting on: `after()` runs the database write once the page has already been
 * sent, and any failure here is swallowed so a broken analytics write can never
 * break the page itself.
 *
 * Geolocation comes from Vercel's request headers (free, no third-party service) —
 * in local development, where those headers don't exist, country/city are simply
 * null rather than wrong.
 *
 * Referrer-based "source" is a best-effort signal, not session-level attribution:
 * Next.js client-side navigation between pages on this site sends the *previous*
 * page as the referrer, which is why "internal" is its own bucket rather than being
 * miscounted as "direct" or as an external site. It reliably captures how a visitor
 * *first* arrived, and is progressively less precise for their 4th, 5th, ... page
 * view in the same session.
 */
export async function recordPageView(path: string) {
  const h = await headers();
  const geo = geolocation({ headers: h });
  const referrerRaw = h.get("referer");
  const ownHost = h.get("host");

  let referrerHost: string | null = null;
  try {
    referrerHost = referrerRaw ? new URL(referrerRaw).host : null;
  } catch {
    referrerHost = null;
  }

  const source = classifySource(referrerHost, ownHost);

  after(async () => {
    try {
      await prisma.pageView.create({
        data: {
          path,
          country: geo.country ?? null,
          countryRegion: geo.countryRegion ?? null,
          city: geo.city ?? null,
          referrer: referrerHost,
          source,
        },
      });
    } catch {
      // Analytics must never break the page it's measuring.
    }
  });
}
