export const ROLES = ["admin", "editor", "author", "subscriber"] as const;
export type Role = (typeof ROLES)[number];

export function isRole(value: string): value is Role {
  return (ROLES as readonly string[]).includes(value);
}

export const ROLE_LABELS: Record<Role, string> = {
  admin: "Admin",
  editor: "Editor",
  author: "Author",
  subscriber: "Subscriber",
};

export const ROLE_DESCRIPTIONS: Record<Role, string> = {
  admin: "Full control — manages every article and every user account.",
  editor: "Can create, edit, publish and delete any article, but cannot manage users.",
  author: "Can create articles and edit or delete only their own work.",
  subscriber: "Reader account. No article or user management access.",
};

// Role hierarchy, highest privilege first. Used for self-service guardrails
// (e.g. an admin cannot demote themselves below the rank required to still be an admin).
export const ROLE_RANK: Record<Role, number> = {
  admin: 3,
  editor: 2,
  author: 1,
  subscriber: 0,
};

export function canManageUsers(role: string) {
  return role === "admin";
}

export function canManageAllArticles(role: string) {
  return role === "admin" || role === "editor";
}

export function canManageOwnArticles(role: string) {
  return role === "admin" || role === "editor" || role === "author";
}

export function canAccessNewsroom(role: string) {
  return role !== "subscriber";
}

export function canViewSubscribers(role: string) {
  return role === "admin";
}

/** Contact and advertising enquiries — commercial/reader mail, same tier as subscribers. */
export function canViewEnquiries(role: string) {
  return role === "admin";
}

/**
 * Sending a newsletter mails every subscriber and cannot be undone, so it stays
 * with admins rather than everyone who can publish an article.
 */
export function canSendNewsletter(role: string) {
  return role === "admin";
}

type UserLike = { id: string; isSuperAdmin: boolean };

/**
 * The super admin account (set once, outside the normal admin UI) outranks every
 * other admin — it can only be edited by itself, and can never be deleted by anyone.
 * Regular admins are equal to each other and can manage one another freely.
 */
export function canModifyUser(actor: UserLike, target: UserLike) {
  if (target.isSuperAdmin && actor.id !== target.id) return false;
  return true;
}

export function canDeleteUser(actor: UserLike, target: UserLike) {
  if (target.isSuperAdmin) return false; // never deletable, even by itself
  return canModifyUser(actor, target);
}

/**
 * Site traffic (visit counts, visitor locations, referral sources) is visible only
 * to the super admin, not to regular admins — a deliberately narrower tier than
 * canManageUsers/canViewSubscribers, which any admin can already see.
 */
export function canViewAnalytics(user: { isSuperAdmin: boolean }) {
  return user.isSuperAdmin;
}
