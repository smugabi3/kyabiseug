"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { heartbeatAction, idleLogoutAction } from "@/lib/admin-actions";

const IDLE_LIMIT_MS = 30 * 60 * 1000;
/** How often to re-check; also caps how long a lapsed session lingers on screen. */
const CHECK_INTERVAL_MS = 30 * 1000;
/** Don't hit the server on every mousemove — extend the window at most this often. */
const HEARTBEAT_THROTTLE_MS = 5 * 60 * 1000;

const ACTIVITY_EVENTS = ["mousemove", "mousedown", "keydown", "scroll", "touchstart", "click"];

/**
 * Signs staff out after 30 minutes without interaction.
 *
 * The server is the real authority here — sessions are a rolling 30-minute window
 * (see lib/auth.ts), so an abandoned tab lapses whether or not this component ever
 * runs. This adds the immediate part: redirecting the moment the window is up,
 * instead of leaving a dead dashboard on screen until the next navigation.
 *
 * Timers are only a hint, never the decider: background tabs get their timers
 * heavily throttled by browsers, so elapsed time is measured against a recorded
 * timestamp and re-checked on visibilitychange. That way a tab left in the
 * background for hours is signed out the instant it is looked at again.
 */
export function IdleLogout() {
  const router = useRouter();
  // Seeded in the effect rather than here: reading the clock during render is
  // impure, and the mount time is the correct starting point anyway.
  const lastActivityRef = useRef(0);
  const lastHeartbeatRef = useRef(0);
  const loggingOutRef = useRef(false);

  useEffect(() => {
    lastActivityRef.current = Date.now();
    lastHeartbeatRef.current = Date.now();

    const markActive = () => {
      lastActivityRef.current = Date.now();
    };

    for (const event of ACTIVITY_EVENTS) {
      window.addEventListener(event, markActive, { passive: true });
    }

    async function evaluate() {
      if (loggingOutRef.current) return;
      const idleFor = Date.now() - lastActivityRef.current;

      if (idleFor >= IDLE_LIMIT_MS) {
        loggingOutRef.current = true;
        await idleLogoutAction().catch(() => {
          // The redirect inside the action is expected to throw; either way the
          // cookie is gone, so fall through to a client-side navigation.
        });
        router.push("/admin/login?reason=idle");
        return;
      }

      if (Date.now() - lastHeartbeatRef.current >= HEARTBEAT_THROTTLE_MS) {
        lastHeartbeatRef.current = Date.now();
        try {
          const { alive } = await heartbeatAction();
          if (!alive) {
            loggingOutRef.current = true;
            router.push("/admin/login?reason=idle");
          }
        } catch {
          // Offline or a transient failure — try again on the next tick.
        }
      }
    }

    const interval = setInterval(evaluate, CHECK_INTERVAL_MS);
    const onVisible = () => {
      if (document.visibilityState === "visible") void evaluate();
    };
    document.addEventListener("visibilitychange", onVisible);

    return () => {
      for (const event of ACTIVITY_EVENTS) window.removeEventListener(event, markActive);
      document.removeEventListener("visibilitychange", onVisible);
      clearInterval(interval);
    };
  }, [router]);

  return null;
}
