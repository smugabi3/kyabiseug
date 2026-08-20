"use client";

import { useEffect, useState } from "react";
import { useMounted } from "@/lib/use-mounted";

/**
 * Always shows Uganda's local time (East Africa Time, UTC+3) regardless of the
 * visitor's or server's own timezone — Intl's explicit `timeZone` option handles
 * the conversion, no timezone library needed. Ticks every second on the client;
 * server-rendered output is intentionally empty (see useMounted) so the "current
 * time" is never baked into cached/static HTML and never causes a hydration
 * mismatch against the client's own clock.
 */
function formatEAT(date: Date) {
  const datePart = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Africa/Kampala",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
  const timePart = new Intl.DateTimeFormat("en-US", {
    timeZone: "Africa/Kampala",
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  }).format(date);
  return `${datePart}, ${timePart} EAT`;
}

export function LiveClock() {
  const mounted = useMounted();
  const [now, setNow] = useState<Date>(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  if (!mounted) return null;

  return <span>{formatEAT(now)}</span>;
}
