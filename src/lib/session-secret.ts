const DEV_FALLBACK = "kyabiseug-dev-secret-change-in-production";

let cached: Uint8Array | null = null;

/**
 * Shared signing key for session cookies, used by both the auth helpers and the
 * proxy. Kept in one place so the two can never drift apart and start rejecting
 * each other's tokens.
 *
 * In production a real SESSION_SECRET is mandatory: this repo is public, so the
 * development fallback is effectively common knowledge and anyone could use it to
 * forge an admin session.
 *
 * Resolved lazily rather than at module load. `next build` evaluates modules with
 * NODE_ENV=production, so throwing at import time would break builds on machines
 * that legitimately have no runtime secret set. Deferring to first use means the
 * build stays green while any real attempt to sign or verify a session still fails
 * loudly rather than silently trusting a public key.
 */
export function getSessionSecret(): Uint8Array {
  if (cached) return cached;

  const secret = process.env.SESSION_SECRET;

  if (!secret) {
    if (process.env.NODE_ENV === "production") {
      throw new Error(
        "SESSION_SECRET is not set. Generate one with `openssl rand -base64 32` and add it " +
          "to your environment variables before deploying."
      );
    }
    return new TextEncoder().encode(DEV_FALLBACK);
  }

  cached = new TextEncoder().encode(secret);
  return cached;
}

export const SESSION_COOKIE = "kyabiseug_session";
