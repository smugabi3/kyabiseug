"use client";

import { useState } from "react";
import Image from "next/image";
import { ImageIcon } from "lucide-react";

export function CoverImageInput({
  name,
  currentImageUrl,
}: {
  name: string;
  currentImageUrl?: string;
}) {
  const [preview, setPreview] = useState<string | null>(null);

  return (
    <div className="flex items-center gap-4">
      <div className="border-border bg-surface-alt relative h-20 w-32 shrink-0 overflow-hidden rounded-lg border">
        {preview ? (
          // Blob preview URLs can't go through next/image, which only optimizes
          // known remote/local sources — a plain <img> is the right tool here.
          // eslint-disable-next-line @next/next/no-img-element
          <img src={preview} alt="" className="h-full w-full object-cover" />
        ) : currentImageUrl ? (
          <Image src={currentImageUrl} alt="" fill sizes="128px" className="object-cover" />
        ) : (
          <div className="text-ink-soft flex h-full w-full items-center justify-center">
            <ImageIcon className="h-6 w-6" />
          </div>
        )}
      </div>

      <input
        type="file"
        name={name}
        accept="image/jpeg,image/png,image/webp,image/gif"
        onChange={(e) => {
          const file = e.target.files?.[0];
          setPreview(file ? URL.createObjectURL(file) : null);
        }}
        className="file:font-headline text-ink-muted file:bg-brand hover:file:bg-brand-ink cursor-pointer text-sm file:mr-4 file:cursor-pointer file:rounded-full file:border-0 file:px-4 file:py-2 file:text-xs file:font-bold file:tracking-wide file:text-white file:uppercase"
      />
    </div>
  );
}
