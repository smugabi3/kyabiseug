import { createHash } from "node:crypto";

function getConfig() {
  const apiKey = process.env.MAILCHIMP_API_KEY;
  const audienceId = process.env.MAILCHIMP_AUDIENCE_ID;
  if (!apiKey || !audienceId) return null;

  const dc = apiKey.split("-").at(-1);
  if (!dc) return null;

  return { apiKey, audienceId, dc };
}

export function isMailchimpConfigured() {
  return getConfig() !== null;
}

/**
 * Adds (or re-syncs) an email to the configured Mailchimp audience. Uses PUT with
 * `status_if_new` so it's idempotent — subscribing an existing member never
 * overwrites a prior unsubscribe, and re-subscribing the same address twice is safe.
 * Returns ok:true when Mailchimp isn't configured at all, since the caller already
 * persists the subscriber locally and shouldn't fail the signup over missing config.
 */
export async function addToMailchimp(email: string): Promise<{ ok: boolean; error?: string }> {
  const config = getConfig();
  if (!config) return { ok: true };

  const hash = createHash("md5").update(email.toLowerCase()).digest("hex");
  const url = `https://${config.dc}.api.mailchimp.com/3.0/lists/${config.audienceId}/members/${hash}`;

  try {
    const res = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${Buffer.from(`anystring:${config.apiKey}`).toString("base64")}`,
      },
      body: JSON.stringify({
        email_address: email,
        status_if_new: "subscribed",
      }),
    });

    if (!res.ok) {
      const body = await res.json().catch(() => null);
      return { ok: false, error: body?.detail ?? `Mailchimp error (${res.status})` };
    }
    return { ok: true };
  } catch {
    return { ok: false, error: "Could not reach Mailchimp." };
  }
}
