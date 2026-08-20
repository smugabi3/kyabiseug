"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { canSendNewsletter } from "@/lib/roles";
import { isEmailConfigured, sendBatch } from "@/lib/email";
import { renderNewsletterHtml, type NewsletterBlock } from "@/lib/newsletter";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

export type SendState = { ok?: boolean; error?: string; message?: string };

async function siteUrl() {
  const h = await headers();
  const host = h.get("host") ?? "kyabiseug.vercel.app";
  const proto = host.startsWith("localhost") ? "http" : "https";
  return `${proto}://${host}`;
}

function parseBlocks(raw: string): NewsletterBlock[] {
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (b): b is NewsletterBlock =>
        b &&
        ((b.type === "text" && typeof b.value === "string") ||
          (b.type === "image" && typeof b.url === "string"))
    );
  } catch {
    return [];
  }
}

export async function sendNewsletterAction(
  _prev: SendState | undefined,
  formData: FormData
): Promise<SendState> {
  const user = await getCurrentUser();
  if (!user || !canSendNewsletter(user.role)) {
    return { error: "You don't have permission to send newsletters." };
  }

  const subject = String(formData.get("subject") ?? "").trim();
  const blocks = parseBlocks(String(formData.get("blocks") ?? "[]"));

  if (!subject) return { error: "Please add a topic or heading." };

  const hasContent = blocks.some((b) =>
    b.type === "text" ? b.value.trim().length > 0 : Boolean(b.url)
  );
  if (!hasContent) return { error: "Please add some content before sending." };

  if (!isEmailConfigured()) {
    return {
      error:
        "Email sending isn't configured yet. Add a RESEND_API_KEY environment variable in Vercel, then redeploy.",
    };
  }

  const subscribers = await prisma.newsletterSubscriber.findMany({
    select: { email: true, unsubscribeToken: true },
  });

  // Guard against the same person appearing twice under different casing. The
  // column is unique but case-sensitive, so historical rows can still collide.
  const seen = new Set<string>();
  const recipients = subscribers.filter((s) => {
    const key = s.email.trim().toLowerCase();
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  if (recipients.length === 0) {
    return { error: "There are no subscribers to send to yet." };
  }

  const base = await siteUrl();

  const messages = recipients.map((r) => ({
    to: r.email,
    subject,
    html: renderNewsletterHtml({
      subject,
      blocks,
      siteUrl: base,
      // Per-recipient link, so unsubscribing removes the right person.
      unsubscribeUrl: `${base}/unsubscribe?token=${encodeURIComponent(r.unsubscribeToken)}`,
    }),
  }));

  const result = await sendBatch(messages);

  await prisma.newsletter.create({
    data: {
      subject,
      blocks: blocks as unknown as object[],
      html: messages[0]?.html ?? "",
      recipientCount: result.sent,
      failedCount: result.failed,
      sentByName: user.name,
    },
  });

  revalidatePath("/admin/newsletter");

  if (result.sent === 0) {
    return { error: result.error ?? "The newsletter could not be sent." };
  }

  return {
    ok: true,
    message:
      result.failed > 0
        ? `Sent to ${result.sent} subscriber${result.sent === 1 ? "" : "s"}, but ${result.failed} failed.`
        : `Sent to ${result.sent} subscriber${result.sent === 1 ? "" : "s"}.`,
  };
}

/** Uploads an image for use inside a newsletter body. */
export async function uploadNewsletterImageAction(
  formData: FormData
): Promise<{ url?: string; error?: string }> {
  const user = await getCurrentUser();
  if (!user || !canSendNewsletter(user.role)) {
    return { error: "You don't have permission to do that." };
  }

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return { error: "Please choose an image." };
  }

  const { uploadImage } = await import("@/lib/upload");
  const result = await uploadImage(file, "newsletter", "newsletter");
  return "error" in result ? { error: result.error } : { url: result.url };
}
