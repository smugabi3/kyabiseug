"use client";

import { useState } from "react";
import { Check, Link2, MessageCircle } from "lucide-react";
import { SocialIcon } from "@/components/social-icon";

export function ShareButtons({ title, path }: { title: string; path: string }) {
  const [copied, setCopied] = useState(false);

  const url = typeof window !== "undefined" ? `${window.location.origin}${path}` : path;
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard unavailable, ignore
    }
  }

  const links = [
    {
      label: "Facebook",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      icon: <SocialIcon platform="facebook" className="h-4 w-4" />,
    },
    {
      label: "Twitter",
      href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
      icon: <SocialIcon platform="twitter" className="h-4 w-4" />,
    },
    {
      label: "WhatsApp",
      href: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
      icon: <MessageCircle className="h-4 w-4" />,
    },
  ];

  return (
    <div className="flex items-center gap-2">
      <span className="text-ink-soft text-xs font-bold tracking-wide uppercase">Share</span>
      {links.map((l) => (
        <a
          key={l.label}
          href={l.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Share on ${l.label}`}
          className="border-border text-ink-muted hover:border-brand hover:text-brand flex h-9 w-9 items-center justify-center rounded-full border transition"
        >
          {l.icon}
        </a>
      ))}
      <button
        type="button"
        onClick={copyLink}
        aria-label="Copy link"
        className="border-border text-ink-muted hover:border-brand hover:text-brand flex h-9 w-9 items-center justify-center rounded-full border transition"
      >
        {copied ? <Check className="text-cat-sports h-4 w-4" /> : <Link2 className="h-4 w-4" />}
      </button>
    </div>
  );
}
