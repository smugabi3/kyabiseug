import { submitComment } from "@/lib/actions";
import { timeAgo } from "@/lib/utils";
import { MessageCircle } from "lucide-react";

type CommentItem = { id: string; name: string; body: string; createdAt: Date | string };

export function CommentSection({
  articleId,
  slug,
  comments,
}: {
  articleId: string;
  slug: string;
  comments: CommentItem[];
}) {
  return (
    <section className="mt-12 border-t border-border pt-8">
      <div className="mb-6 flex items-center gap-2">
        <MessageCircle className="h-5 w-5 text-brand" />
        <h2 className="font-headline text-xl font-extrabold uppercase tracking-tight text-ink">
          {comments.length} Comment{comments.length === 1 ? "" : "s"}
        </h2>
      </div>

      <form action={submitComment} className="mb-10 space-y-3 rounded-xl border border-border bg-surface-alt p-5">
        <input type="hidden" name="articleId" value={articleId} />
        <input type="hidden" name="slug" value={slug} />
        <div className="grid gap-3 sm:grid-cols-2">
          <input
            name="name"
            required
            maxLength={80}
            placeholder="Your name"
            className="rounded-lg border border-border bg-surface px-3 py-2 text-sm text-ink outline-none focus:border-brand"
          />
        </div>
        <textarea
          name="body"
          required
          maxLength={2000}
          rows={3}
          placeholder="Join the conversation..."
          className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-ink outline-none focus:border-brand"
        />
        <button
          type="submit"
          className="rounded-full bg-brand px-5 py-2 font-headline text-xs font-bold uppercase tracking-wide text-white transition hover:bg-brand-ink"
        >
          Post Comment
        </button>
      </form>

      {comments.length > 0 && (
        <ul className="space-y-6">
          {comments.map((c) => (
            <li key={c.id} className="flex gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-tint font-headline text-sm font-bold text-brand">
                {c.name.charAt(0).toUpperCase()}
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-headline text-sm font-bold text-ink">{c.name}</span>
                  <span className="text-xs text-ink-soft">{timeAgo(c.createdAt)}</span>
                </div>
                <p className="mt-1 text-sm leading-relaxed text-ink-muted">{c.body}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
