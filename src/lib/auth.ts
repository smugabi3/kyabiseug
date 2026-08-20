import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { SESSION_COOKIE, getSessionSecret } from "@/lib/session-secret";

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

/**
 * Staff sessions expire 30 minutes after the last sign of activity.
 *
 * This is a rolling window enforced by the token and cookie themselves, not just
 * by a client-side timer: `refreshSession` re-issues both while the user is
 * active, so genuine inactivity lets them lapse on their own. That matters
 * because a JavaScript-only idle timer is a convenience, not a security
 * boundary — it does nothing for a browser that was closed, or a stolen cookie
 * replayed later.
 */
export const SESSION_IDLE_SECONDS = 30 * 60;

export async function createSession(userId: string) {
  const token = await new SignJWT({ userId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_IDLE_SECONDS}s`)
    .sign(getSessionSecret());

  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_IDLE_SECONDS,
  });
}

/**
 * Extends the idle window for a still-active user. Returns false when the
 * session has already lapsed, so the caller can send them to the login page
 * rather than silently minting a fresh session for someone who timed out.
 */
export async function refreshSession(): Promise<boolean> {
  const userId = await getSessionUserId();
  if (!userId) return false;
  await createSession(userId);
  return true;
}

export async function destroySession() {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
}

async function getSessionUserId(): Promise<string | null> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, getSessionSecret());
    return typeof payload.userId === "string" ? payload.userId : null;
  } catch {
    return null;
  }
}

/**
 * Resolves the logged-in user's identity fresh from the database on every call,
 * rather than trusting a cached role/name inside the session token. This means a
 * role change or account deletion takes effect on the user's very next request
 * instead of only when their session eventually expires.
 */
export async function getCurrentUser() {
  const userId = await getSessionUserId();
  if (!userId) return null;
  return prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, name: true, email: true, role: true, isSuperAdmin: true },
  });
}

export { SESSION_COOKIE };
