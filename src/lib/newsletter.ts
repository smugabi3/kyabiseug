export type NewsletterBlock =
  { type: "text"; value: string } | { type: "image"; url: string; alt: string };

export const CONTACT_EMAIL = "info@kyabiseuganda.com";

/** Escapes text before it goes into email HTML. */
function esc(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * Renders blocks as email HTML.
 *
 * Written with tables and inline styles rather than modern CSS on purpose:
 * Outlook renders through Word's HTML engine and ignores most external and
 * flexbox styling, so anything laid out the way the website is would collapse.
 * Images are capped with both a width attribute and max-width so they scale on
 * phones without overflowing narrow clients.
 */
export function renderNewsletterHtml({
  subject,
  blocks,
  siteUrl,
  unsubscribeUrl,
}: {
  subject: string;
  blocks: NewsletterBlock[];
  siteUrl: string;
  unsubscribeUrl: string;
}) {
  const body = blocks
    .map((block) => {
      if (block.type === "image") {
        if (!block.url) return "";
        return `<tr><td style="padding:0 0 20px 0;">
<img src="${esc(block.url)}" alt="${esc(block.alt)}" width="560" style="display:block;width:100%;max-width:560px;height:auto;border:0;border-radius:8px;" />
</td></tr>`;
      }
      if (!block.value.trim()) return "";
      // Blank lines separate paragraphs, matching how the composer behaves.
      const paragraphs = block.value
        .split(/\n\s*\n/)
        .map((p) => p.trim())
        .filter(Boolean)
        .map(
          (p) =>
            `<p style="margin:0 0 16px 0;font-size:16px;line-height:1.6;color:#14130f;">${esc(p).replace(/\n/g, "<br />")}</p>`
        )
        .join("");
      return `<tr><td style="padding:0 0 8px 0;">${paragraphs}</td></tr>`;
    })
    .join("");

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<title>${esc(subject)}</title>
</head>
<body style="margin:0;padding:0;background:#f6f5f2;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f6f5f2;padding:24px 12px;">
<tr><td align="center">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:100%;max-width:600px;background:#ffffff;border-radius:12px;overflow:hidden;">

<tr><td style="padding:24px 32px;border-bottom:3px solid #d21034;">
<a href="${esc(siteUrl)}" style="text-decoration:none;">
<span style="font-family:Arial,Helvetica,sans-serif;font-size:22px;font-weight:bold;color:#14130f;letter-spacing:-0.5px;">Kyabise</span><span style="font-family:Arial,Helvetica,sans-serif;font-size:22px;font-weight:bold;color:#ffffff;background:#d21034;padding:2px 6px;border-radius:4px;">UG</span>
</a>
<div style="font-family:Arial,Helvetica,sans-serif;font-size:10px;letter-spacing:1.5px;color:#837f74;text-transform:uppercase;margin-top:6px;">Uganda's Voice &middot; The World's Story</div>
</td></tr>

<tr><td style="padding:32px 32px 8px 32px;">
<h1 style="margin:0 0 20px 0;font-family:Arial,Helvetica,sans-serif;font-size:26px;line-height:1.25;color:#14130f;">${esc(subject)}</h1>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-family:Arial,Helvetica,sans-serif;">${body}</table>
</td></tr>

<tr><td style="padding:24px 32px 28px 32px;border-top:1px solid #e4e1da;background:#f6f5f2;font-family:Arial,Helvetica,sans-serif;">
<p style="margin:0 0 10px 0;font-size:13px;font-weight:bold;color:#14130f;">KyabiseUG</p>
<p style="margin:0 0 4px 0;font-size:13px;color:#55524a;">
Email: <a href="mailto:${CONTACT_EMAIL}" style="color:#d21034;text-decoration:none;">${CONTACT_EMAIL}</a>
</p>
<p style="margin:0 0 4px 0;font-size:13px;color:#55524a;">
Website: <a href="${esc(siteUrl)}" style="color:#d21034;text-decoration:none;">${esc(siteUrl.replace(/^https?:\/\//, ""))}</a>
</p>
<p style="margin:0 0 16px 0;font-size:13px;color:#55524a;">
<a href="${esc(siteUrl)}/contact" style="color:#d21034;text-decoration:none;">Contact us</a>
</p>
<p style="margin:0;font-size:11px;color:#837f74;line-height:1.5;">
You are receiving this because you subscribed to the KyabiseUG newsletter.<br />
<a href="${esc(unsubscribeUrl)}" style="color:#837f74;text-decoration:underline;">Unsubscribe</a>
</p>
</td></tr>

</table>
</td></tr>
</table>
</body>
</html>`;
}
