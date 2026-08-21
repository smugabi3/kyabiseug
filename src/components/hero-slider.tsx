"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { categoryColor } from "@/lib/categories";
import { timeAgo } from "@/lib/utils";

export type HeroSlide = {
  slug: string;
  title: string;
  dek: string;
  coverImage: string;
  author: string;
  publishedAt: string;
  isBreaking: boolean;
  category: { slug: string; name: string };
};

const INTERVAL_MS = 6000;

export function HeroSlider({ slides }: { slides: HeroSlide[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const go = useCallback(
    (next: number) => setIndex(((next % slides.length) + slides.length) % slides.length),
    [slides.length]
  );

  useEffect(() => {
    if (paused || slides.length < 2) return;

    // Readers who have asked their system to reduce motion get a static hero
    // rather than something that moves under them while they're reading.
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    timer.current = setInterval(() => setIndex((i) => (i + 1) % slides.length), INTERVAL_MS);
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [paused, slides.length]);

  if (slides.length === 0) return null;

  const current = slides[index];
  const accent = categoryColor(current.category.slug);

  return (
    <section
      // Pausing on hover and on keyboard focus: without it the story someone is
      // halfway through reading is replaced out from under them.
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
      aria-roledescription="carousel"
      aria-label="Top stories"
    >
      <div className="mb-4 flex items-center justify-between gap-4">
        <h1
          className="font-headline text-2xl font-extrabold tracking-tight uppercase transition-colors sm:text-3xl"
          style={{ color: accent }}
        >
          Top Stories
        </h1>
        <Link
          href={`/category/${current.category.slug}`}
          className="text-ink-muted hover:text-brand shrink-0 text-xs font-bold tracking-wide uppercase"
        >
          All {current.category.name} News
        </Link>
      </div>

      <div className="group block">
        <div className="bg-surface-alt relative aspect-[16/9] overflow-hidden rounded-xl sm:aspect-[2/1]">
          {slides.map((slide, i) => (
            <Link
              key={slide.slug}
              href={`/article/${slide.slug}`}
              aria-hidden={i !== index}
              tabIndex={i === index ? 0 : -1}
              className={
                "absolute inset-0 transition-opacity duration-700 " +
                (i === index ? "opacity-100" : "pointer-events-none opacity-0")
              }
            >
              <Image
                src={slide.coverImage}
                alt=""
                fill
                // Only the first slide is priority; the rest would otherwise
                // compete with it for bandwidth on first paint.
                priority={i === 0}
                sizes="(min-width: 1024px) 66vw, 100vw"
                className="object-cover transition duration-300 group-hover:scale-105"
              />
              {slide.isBreaking && (
                <span className="bg-brand font-headline absolute top-4 left-4 rounded px-2.5 py-1 text-xs font-bold tracking-wider text-white uppercase shadow">
                  Breaking
                </span>
              )}
            </Link>
          ))}

          {slides.length > 1 && (
            <>
              <SliderButton side="left" onClick={() => go(index - 1)} label="Previous story" />
              <SliderButton side="right" onClick={() => go(index + 1)} label="Next story" />
            </>
          )}
        </div>

        <div className="mt-4">
          <Link
            href={`/category/${current.category.slug}`}
            className="inline-flex items-center gap-1 text-xs font-bold tracking-wider uppercase hover:underline"
            style={{ color: accent }}
          >
            <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: accent }} />
            {current.category.name}
          </Link>

          {/* aria-live so a screen reader hears the new headline when the slide
              changes, instead of the change happening silently. */}
          <div aria-live="polite" aria-atomic="true">
            <Link href={`/article/${current.slug}`}>
              <h2 className="font-headline text-ink group-hover:text-brand mt-2 text-3xl leading-[1.05] font-extrabold sm:text-4xl">
                {current.title}
              </h2>
            </Link>
            <p className="text-ink-muted mt-3 max-w-2xl text-base leading-relaxed">{current.dek}</p>
            <p className="text-ink-soft mt-3 text-xs">
              By {current.author} &middot; {timeAgo(current.publishedAt)}
            </p>
          </div>

          {slides.length > 1 && (
            <div className="mt-4 flex items-center gap-2">
              {slides.map((slide, i) => (
                <button
                  key={slide.slug}
                  type="button"
                  onClick={() => go(i)}
                  aria-label={`Show ${slide.category.name} story`}
                  aria-current={i === index}
                  className={
                    "h-1.5 rounded-full transition-all " +
                    (i === index ? "w-8" : "bg-ink-soft/30 hover:bg-ink-soft/60 w-4")
                  }
                  style={i === index ? { backgroundColor: accent } : undefined}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function SliderButton({
  side,
  onClick,
  label,
}: {
  side: "left" | "right";
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={
        "absolute top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white opacity-0 transition group-hover:opacity-100 hover:bg-black/60 focus-visible:opacity-100 " +
        (side === "left" ? "left-3" : "right-3")
      }
    >
      {side === "left" ? <ChevronLeft className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
    </button>
  );
}
