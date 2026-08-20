"use client";

import { useActionState, useState } from "react";
import Image from "next/image";
import {
  sendNewsletterAction,
  uploadNewsletterImageAction,
  type SendState,
} from "@/lib/newsletter-actions";
import type { NewsletterBlock } from "@/lib/newsletter";
import {
  ArrowDown,
  ArrowUp,
  CheckCircle2,
  ImageIcon,
  Loader2,
  Send,
  Trash2,
  Type,
} from "lucide-react";

type Block = NewsletterBlock & { id: string };

const newId = () => Math.random().toString(36).slice(2, 10);

export function NewsletterComposer({
  subscriberCount,
  emailConfigured,
}: {
  subscriberCount: number;
  emailConfigured: boolean;
}) {
  const [blocks, setBlocks] = useState<Block[]>([{ id: newId(), type: "text", value: "" }]);
  const [confirming, setConfirming] = useState(false);
  const [uploading, setUploading] = useState<string | null>(null);
  const [state, formAction, pending] = useActionState<SendState | undefined, FormData>(
    sendNewsletterAction,
    undefined
  );

  const update = (id: string, patch: Partial<Block>) =>
    setBlocks((bs) => bs.map((b) => (b.id === id ? ({ ...b, ...patch } as Block) : b)));

  const remove = (id: string) => setBlocks((bs) => bs.filter((b) => b.id !== id));

  const move = (id: string, dir: -1 | 1) =>
    setBlocks((bs) => {
      const i = bs.findIndex((b) => b.id === id);
      const j = i + dir;
      if (i < 0 || j < 0 || j >= bs.length) return bs;
      const next = [...bs];
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });

  async function handleUpload(id: string, file: File) {
    setUploading(id);
    const fd = new FormData();
    fd.append("file", file);
    const res = await uploadNewsletterImageAction(fd);
    setUploading(null);
    if (res.url) update(id, { url: res.url });
    else if (res.error) alert(res.error);
  }

  if (state?.ok) {
    return (
      <div className="border-border bg-surface rounded-xl border p-10 text-center">
        <CheckCircle2 className="text-cat-sports mx-auto h-10 w-10" />
        <h2 className="font-headline text-ink mt-4 text-xl font-bold">Newsletter sent</h2>
        <p className="text-ink-muted mt-2 text-sm">{state.message}</p>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="bg-brand font-headline hover:bg-brand-ink mt-6 rounded-full px-5 py-2.5 text-xs font-bold tracking-wide text-white uppercase transition"
        >
          Write another
        </button>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-6">
      <input type="hidden" name="blocks" value={JSON.stringify(blocks.map(({ ...b }) => b))} />

      <label className="block">
        <span className="text-ink-muted mb-1 block text-xs font-bold tracking-wide uppercase">
          Topic / Heading
        </span>
        <input
          name="subject"
          required
          className="input"
          placeholder="What is this newsletter about?"
        />
        <span className="text-ink-soft mt-1 block text-xs">
          Also used as the email subject line.
        </span>
      </label>

      <div>
        <span className="text-ink-muted mb-2 block text-xs font-bold tracking-wide uppercase">
          Message
        </span>

        <div className="space-y-3">
          {blocks.map((block, i) => (
            <div key={block.id} className="border-border bg-surface rounded-xl border p-3">
              <div className="mb-2 flex items-center gap-2">
                <span className="text-ink-soft flex items-center gap-1.5 text-xs font-bold uppercase">
                  {block.type === "text" ? (
                    <>
                      <Type className="h-3.5 w-3.5" /> Text
                    </>
                  ) : (
                    <>
                      <ImageIcon className="h-3.5 w-3.5" /> Image
                    </>
                  )}
                </span>
                <div className="ml-auto flex items-center gap-1">
                  <IconBtn
                    label="Move up"
                    disabled={i === 0}
                    onClick={() => move(block.id, -1)}
                    icon={<ArrowUp className="h-3.5 w-3.5" />}
                  />
                  <IconBtn
                    label="Move down"
                    disabled={i === blocks.length - 1}
                    onClick={() => move(block.id, 1)}
                    icon={<ArrowDown className="h-3.5 w-3.5" />}
                  />
                  <IconBtn
                    label="Remove"
                    disabled={blocks.length === 1}
                    onClick={() => remove(block.id)}
                    icon={<Trash2 className="h-3.5 w-3.5" />}
                  />
                </div>
              </div>

              {block.type === "text" ? (
                <textarea
                  rows={5}
                  value={block.value}
                  onChange={(e) => update(block.id, { value: e.target.value })}
                  className="input"
                  placeholder="Write this part of the message. Leave a blank line between paragraphs."
                />
              ) : (
                <div className="flex flex-wrap items-center gap-4">
                  <div className="border-border bg-surface-alt relative h-24 w-36 shrink-0 overflow-hidden rounded-lg border">
                    {block.url ? (
                      <Image src={block.url} alt="" fill sizes="144px" className="object-cover" />
                    ) : (
                      <div className="text-ink-soft flex h-full items-center justify-center">
                        {uploading === block.id ? (
                          <Loader2 className="h-5 w-5 animate-spin" />
                        ) : (
                          <ImageIcon className="h-6 w-6" />
                        )}
                      </div>
                    )}
                  </div>
                  <div className="min-w-[12rem] flex-1 space-y-2">
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/gif"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) void handleUpload(block.id, f);
                      }}
                      className="file:font-headline text-ink-muted file:bg-brand hover:file:bg-brand-ink w-full cursor-pointer text-sm file:mr-3 file:cursor-pointer file:rounded-full file:border-0 file:px-3 file:py-1.5 file:text-xs file:font-bold file:tracking-wide file:text-white file:uppercase"
                    />
                    <input
                      value={block.alt ?? ""}
                      onChange={(e) => update(block.id, { alt: e.target.value })}
                      className="input"
                      placeholder="Describe the image (shown if it doesn't load)"
                    />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          <AddBtn
            onClick={() => setBlocks((bs) => [...bs, { id: newId(), type: "text", value: "" }])}
            icon={<Type className="h-3.5 w-3.5" />}
            label="Add text"
          />
          <AddBtn
            onClick={() =>
              setBlocks((bs) => [...bs, { id: newId(), type: "image", url: "", alt: "" }])
            }
            icon={<ImageIcon className="h-3.5 w-3.5" />}
            label="Add image"
          />
        </div>
      </div>

      <div className="border-border bg-surface-alt rounded-xl border p-4">
        <p className="text-ink-muted text-xs leading-relaxed">
          Every email automatically ends with KyabiseUG&apos;s contact details — email, a link to
          the website, a link to the contact page — and a one-click unsubscribe link.
        </p>
      </div>

      {state?.error && <p className="text-brand text-sm">{state.error}</p>}

      {!emailConfigured && (
        <p className="bg-gold/15 text-gold-ink rounded-lg px-3 py-2.5 text-xs">
          Email sending isn&apos;t configured yet, so the send button is disabled. Add a
          <code className="mx-1">RESEND_API_KEY</code> environment variable in Vercel and redeploy.
        </p>
      )}

      {confirming ? (
        <div className="border-brand bg-surface flex flex-wrap items-center gap-3 rounded-xl border p-4">
          <p className="text-ink min-w-[14rem] flex-1 text-sm">
            Send to <strong>{subscriberCount}</strong> subscriber
            {subscriberCount === 1 ? "" : "s"}? This can&apos;t be undone.
          </p>
          <button
            type="submit"
            disabled={pending}
            className="bg-brand font-headline hover:bg-brand-ink flex items-center gap-1.5 rounded-full px-5 py-2.5 text-xs font-bold tracking-wide text-white uppercase transition disabled:opacity-60"
          >
            {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            {pending ? "Sending..." : "Yes, send now"}
          </button>
          <button
            type="button"
            onClick={() => setConfirming(false)}
            disabled={pending}
            className="border-border text-ink-muted hover:border-brand hover:text-brand rounded-full border px-5 py-2.5 text-xs font-bold tracking-wide uppercase transition"
          >
            Cancel
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setConfirming(true)}
          disabled={!emailConfigured || subscriberCount === 0}
          className="bg-brand font-headline hover:bg-brand-ink flex items-center gap-2 rounded-full px-6 py-3 text-sm font-bold tracking-wide text-white uppercase transition disabled:opacity-50"
        >
          <Send className="h-4 w-4" />
          Send to {subscriberCount} subscriber{subscriberCount === 1 ? "" : "s"}
        </button>
      )}
    </form>
  );
}

function IconBtn({
  label,
  icon,
  onClick,
  disabled,
}: {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      disabled={disabled}
      className="border-border text-ink-muted hover:border-brand hover:text-brand rounded-full border p-1.5 transition disabled:opacity-30"
    >
      {icon}
    </button>
  );
}

function AddBtn({
  label,
  icon,
  onClick,
}: {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="border-border font-headline text-ink-muted hover:border-brand hover:text-brand flex items-center gap-1.5 rounded-full border px-4 py-2 text-xs font-bold tracking-wide uppercase transition"
    >
      {icon}
      {label}
    </button>
  );
}
