"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { addToMailchimp } from "@/lib/mailchimp";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function subscribeNewsletter(
  email: string
): Promise<{ ok: boolean; message: string }> {
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

export async function submitComment(formData: FormData) {
  const articleId = String(formData.get("articleId") ?? "");
  const slug = String(formData.get("slug") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  const body = String(formData.get("body") ?? "").trim();

  if (!articleId || !name || !body) return;

  await prisma.comment.create({
    data: { articleId, name: name.slice(0, 80), body: body.slice(0, 2000) },
  });

  revalidatePath(`/article/${slug}`);
}
