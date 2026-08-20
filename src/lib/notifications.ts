import { prisma } from "@/lib/prisma";
import { canViewEnquiries, canViewSubscribers } from "@/lib/roles";

export type AdminBadges = {
  /** Subscribers added since this admin last opened the Subscribers page. */
  newSubscribers: number;
  /** Enquiries still awaiting a reply. Shared, not per-admin: an enquiry stays
   *  outstanding until someone actually deals with it. */
  unhandledEnquiries: number;
};

type Viewer = { id: string; role: string };

/**
 * Counts for the notification badges in the admin nav.
 *
 * Deliberately asymmetric, because the two things mean different things:
 *
 * - Subscribers is "new since *you* last looked" — a per-admin read marker,
 *   which is why it clears when you open the page. Nothing about a subscriber
 *   needs action, so a shared marker would let one admin silently clear the
 *   signal for everyone.
 * - Enquiries is "still unhandled" — genuine outstanding work, shared by the
 *   whole team. Merely reading the page shouldn't dismiss it; the count only
 *   drops when an enquiry is actually marked handled.
 *
 * Returns zeroes for anything the viewer isn't allowed to see, so a badge can
 * never leak the existence of data behind a permission they lack.
 */
export async function getAdminBadges(viewer: Viewer): Promise<AdminBadges> {
  const [newSubscribers, unhandledEnquiries] = await Promise.all([
    canViewSubscribers(viewer.role) ? countNewSubscribers(viewer.id) : Promise.resolve(0),
    canViewEnquiries(viewer.role)
      ? prisma.enquiry.count({ where: { handled: false } })
      : Promise.resolve(0),
  ]);

  return { newSubscribers, unhandledEnquiries };
}

async function countNewSubscribers(userId: string) {
  const marker = await prisma.sectionView.findUnique({
    where: { userId_section: { userId, section: "subscribers" } },
    select: { lastSeen: true },
  });

  // No marker yet: this admin has never opened the page, so everything is new
  // to them rather than nothing being new.
  return prisma.newsletterSubscriber.count(
    marker ? { where: { createdAt: { gt: marker.lastSeen } } } : undefined
  );
}

/**
 * Stamps a section as seen by this admin. Call it *after* reading the data for
 * the page, otherwise the visit clears the very count the page is about to show.
 */
export async function markSectionSeen(userId: string, section: "subscribers" | "enquiries") {
  await prisma.sectionView.upsert({
    where: { userId_section: { userId, section } },
    update: { lastSeen: new Date() },
    create: { userId, section },
  });
}
