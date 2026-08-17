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
    <section className="border-border mt-12 border-t pt-8">
      <div className="mb-6 flex items-center gap-2">
        <MessageCircle className="text-brand h-5 w-5" />
        <h2 className="font-headline text-ink text-xl font-extrabold tracking-tight uppercase">
          {comments.length} Comment{comments.length === 1 ? "" : "s"}
        </h2>
      </div>

      <form
        action={submitComment}
        className="border-border bg-surface-alt mb-10 space-y-3 rounded-xl border p-5"
      >
        <input type="hidden" name="articleId" value={articleId} />
        <input type="hidden" name="slug" value={slug} />
        <div className="grid gap-3 sm:grid-cols-2">
          <input
            name="name"
            required
            maxLength={80}
            placeholder="Your name"
            className="border-border bg-surface text-ink focus:border-brand rounded-lg border px-3 py-2 text-sm outline-none"
          />
        </div>
        <textarea
          name="body"
          required
          maxLength={2000}
          rows={3}
          placeholder="Join the conversation..."
          className="border-border bg-surface text-ink focus:border-brand w-full rounded-lg border px-3 py-2 text-sm outline-none"
        />
        <button
          type="submit"
          className="bg-brand font-headline hover:bg-brand-ink rounded-full px-5 py-2 text-xs font-bold tracking-wide text-white uppercase transition"
        >
          Post Comment
        </button>
      </form>

      {comments.length > 0 && (
        <ul className="space-y-6">
          {comments.map((c) => (
            <li key={c.id} className="flex gap-3">
              <span className="bg-brand-tint font-headline text-brand flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold">
                {c.name.charAt(0).toUpperCase()}
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-headline text-ink text-sm font-bold">{c.name}</span>
                  <span className="text-ink-soft text-xs">{timeAgo(c.createdAt)}</span>
                </div>
                <p className="text-ink-muted mt-1 text-sm leading-relaxed">{c.body}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
