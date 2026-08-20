import { Resend } from "resend";

/** Sender address. Must be on a domain verified in Resend, or delivery is rejected. */
export const NEWSLETTER_FROM =
  process.env.NEWSLETTER_FROM ?? "KyabiseUG <newsletter@kyabiseuganda.com>";

export function isEmailConfigured() {
  return Boolean(process.env.RESEND_API_KEY);
}

export type SendResult = { sent: number; failed: number; error?: string };

type Message = { to: string; subject: string; html: string };

/**
 * Resend accepts up to 100 messages per batch call. Each recipient gets their own
 * message rather than one email with everyone in `to:` — that keeps addresses
 * private from each other and lets every email carry its own unsubscribe link.
 */
const BATCH_SIZE = 100;

export async function sendBatch(messages: Message[]): Promise<SendResult> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return { sent: 0, failed: messages.length, error: "Email sending isn't configured." };
  }
  if (messages.length === 0) return { sent: 0, failed: 0 };

  const resend = new Resend(apiKey);
  let sent = 0;
  let failed = 0;
  let firstError: string | undefined;

  for (let i = 0; i < messages.length; i += BATCH_SIZE) {
    const batch = messages.slice(i, i + BATCH_SIZE);
    try {
      const { error } = await resend.batch.send(
        batch.map((m) => ({ from: NEWSLETTER_FROM, to: [m.to], subject: m.subject, html: m.html }))
      );
      if (error) {
        failed += batch.length;
        firstError ??= error.message;
      } else {
        sent += batch.length;
      }
    } catch (err) {
      // One failing batch shouldn't abandon the rest of the list.
      failed += batch.length;
      firstError ??= err instanceof Error ? err.message : "Unknown sending error.";
    }
  }

  return { sent, failed, error: firstError };
}
