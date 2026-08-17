export function slugify(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 90);
}

export function toHtmlParagraphs(text: string) {
  return text
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean)
    .map((p) => `<p>${p.replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\n/g, "<br/>")}</p>`)
    .join("\n");
}

export function htmlToPlainParagraphs(html: string) {
  return html
    .split(/<\/p>/)
    .map((p) =>
      p
        .replace(/<p>/g, "")
        .replace(/<br\/?>/g, "\n")
        .trim()
    )
    .filter(Boolean)
    .map((p) => p.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&"))
    .join("\n\n");
}
