export function slugify(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 90);
}

const escapeHtml = (t: string) =>
  t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/**
 * A paragraph consisting solely of `![caption](url)` is an inline image. Only
 * https:// and our own /uploads/ URLs are accepted, so the marker can't smuggle in
 * javascript: or data: URLs.
 */
const IMAGE_MARKER = /^!\[([^\]\n]*)\]\(((?:https:\/\/|\/uploads\/)[^\s)"<>]+)\)$/;

export function toHtmlParagraphs(text: string) {
  return text
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean)
    .map((p) => {
      const img = IMAGE_MARKER.exec(p);
      if (img) {
        const [, caption, url] = img;
        const alt = escapeHtml(caption);
        return `<figure><img src="${escapeHtml(url)}" alt="${alt}" loading="lazy"/>${
          caption ? `<figcaption>${alt}</figcaption>` : ""
        }</figure>`;
      }
      return `<p>${p.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\n/g, "<br/>")}</p>`;
    })
    .join("\n");
}

const unescapeHtml = (t: string) =>
  t.replace(/&quot;/g, '"').replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");

export function htmlToPlainParagraphs(html: string) {
  return html
    .split(/<\/p>|<\/figure>/)
    .map((chunk) => {
      const fig = /<figure><img src="([^"]*)" alt="([^"]*)"/.exec(chunk);
      if (fig) return `![${unescapeHtml(fig[2])}](${unescapeHtml(fig[1])})`;
      return unescapeHtml(chunk.replace(/<p>/g, "").replace(/<br\/?>/g, "\n").trim());
    })
    .filter(Boolean)
    .join("\n\n");
}
