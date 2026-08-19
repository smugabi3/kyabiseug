export const CATEGORY_DEFS = [
  {
    slug: "local",
    name: "Local",
    description: "News from Kampala and every corner of Uganda.",
    color: "#D21034",
  },
  {
    slug: "international",
    name: "World",
    description: "International news and global affairs.",
    color: "#1E5AA8",
  },
  {
    slug: "business",
    name: "Business",
    description: "Markets, trade, banking and Uganda's economy.",
    color: "#B45309",
  },
  {
    slug: "sports",
    name: "Sports",
    description: "Football, athletics and Ugandan sport on the world stage.",
    color: "#157F3C",
  },
  {
    slug: "health",
    name: "Health",
    description: "Public health, medicine and wellness.",
    color: "#0E9488",
  },
  {
    slug: "tech",
    name: "Tech",
    description: "Technology, innovation and Uganda's digital economy.",
    color: "#6C4FD0",
  },
  {
    slug: "gospel",
    name: "Gospel",
    description: "Faith, church life and gospel music.",
    color: "#B8860B",
  },
  {
    slug: "entertainment",
    name: "Entertainment & Life",
    description: "Culture, celebrity, lifestyle and the arts.",
    color: "#C23B7A",
  },
] as const;

export type CategorySlug = (typeof CATEGORY_DEFS)[number]["slug"];

export function categoryColor(slug: string) {
  return CATEGORY_DEFS.find((c) => c.slug === slug)?.color ?? "#D21034";
}
