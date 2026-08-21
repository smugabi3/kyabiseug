"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { addToMailchimp } from "@/lib/mailchimp";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function subscribeNewsletter(
  rawEmail: string
): Promise<{ ok: boolean; message: string }> {
  // Normalised before storing: the unique constraint is case-sensitive, so
  // "Sam@x.com" and "sam@x.com" would otherwise become two subscribers and the
  // same person would receive every newsletter twice.
  const email = rawEmail.trim().toLowerCase();

  if (!EMAIL_RE.test(email)) {
    return { ok: false, message: "Please enter a valid email address." };
  }

  try {
    await prisma.newsletterSubscriber.upsert({
      where: { email },
      update: {},
      create: { email },
    });
  } catch {
    return { ok: false, message: "Something went wrong. Please try again." };
  }

  // Local record is the source of truth for the admin Subscribers page; Mailchimp
  // sync is best-effort so a Mailchimp outage never blocks someone from subscribing.
  const mc = await addToMailchimp(email);
  if (!mc.ok) {
    console.error("Mailchimp sync failed for", email, mc.error);
  }

  revalidatePath("/admin/subscribers");
  return { ok: true, message: "You're subscribed! Look out for our next briefing." };
}

/** Comments accepted on one article within the window below, before we stop taking more. */
const COMMENT_LIMIT = 5;
const COMMENT_WINDOW_MINUTES = 10;

export async function submitComment(formData: FormData) {
  const articleId = String(formData.get("articleId") ?? "");
  const slug = String(formData.get("slug") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  const body = String(formData.get("body") ?? "").trim();

  // Honeypot, matching the contact and advertise forms: a field positioned
  // off-screen that only automated submissions fill in. Silently accepted so a
  // bot learns nothing from the response.
  if (String(formData.get("website") ?? "").trim()) return;

  if (!articleId || !name || !body) return;

  // Anonymous comments have no account to attribute a limit to, so this throttles
  // per article. It won't stop a determined spammer spreading across many
  // articles, but it does stop one page being flooded — and unlike IP-based
  // limiting it doesn't require storing data the Privacy Policy says we don't.
  const since = new Date(Date.now() - COMMENT_WINDOW_MINUTES * 60 * 1000);
  const recent = await prisma.comment.count({
    where: { articleId, createdAt: { gte: since } },
  });
  if (recent >= COMMENT_LIMIT) return;

  try {
    await prisma.comment.create({
      data: { articleId, name: name.slice(0, 80), body: body.slice(0, 2000) },
    });
  } catch {
    // A comment posted against an article that has since been deleted would
    // otherwise surface a raw database error to the reader.
    return;
  }

  revalidatePath(`/article/${slug}`);
}
