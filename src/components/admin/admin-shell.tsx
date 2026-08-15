import Link from "next/link";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { logoutAction } from "@/lib/admin-actions";
import {
  canManageOwnArticles,
  canManageUsers,
  canViewSubscribers,
  ROLE_LABELS,
  type Role,
} from "@/lib/roles";
import { LayoutDashboard, Mail, Plus, Users as UsersIcon } from "lucide-react";

export function AdminShell({
  user,
  active,
  children,
}: {
  user: { name: string; email: string; role: string; isSuperAdmin?: boolean };
  active: "dashboard" | "users" | "subscribers" | "other";
  children: React.ReactNode;
}) {
  const role = user.role as Role;
  const roleLabel = user.isSuperAdmin ? "Super Admin" : (ROLE_LABELS[role] ?? role);

  const links = (compact: boolean) => (
    <>
      <ShellLink href="/admin" active={active === "dashboard"} icon={<LayoutDashboard className="h-4 w-4" />}>
        Dashboard
      </ShellLink>
      {canManageUsers(role) && (
        <ShellLink href="/admin/users" active={active === "users"} icon={<UsersIcon className="h-4 w-4" />}>
          Users
        </ShellLink>
      )}
      {canViewSubscribers(role) && (
        <ShellLink href="/admin/subscribers" active={active === "subscribers"} icon={<Mail className="h-4 w-4" />}>
          Subscribers
        </ShellLink>
      )}
      {canManageOwnArticles(role) && (
        <ShellLink href="/admin/articles/new" active={false} icon={<Plus className="h-4 w-4" />}>
          {compact ? "New" : "New Article"}
        </ShellLink>
      )}
    </>
  );

  return (
    <div className="flex min-h-full flex-1 flex-col bg-surface-alt">
      <header className="border-b border-border bg-surface">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-10">
          <div className="flex items-center gap-6">
            <Logo />
            <nav className="hidden items-center gap-1 sm:flex">{links(false)}</nav>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right leading-tight">
              <p className="text-sm font-semibold text-ink">{user.name}</p>
              <p className="text-xs font-bold uppercase tracking-wide text-brand">{roleLabel}</p>
            </div>
            <ThemeToggle />
            <form action={logoutAction}>
              <button
                type="submit"
                className="rounded-full border border-border px-4 py-2 font-headline text-xs font-bold uppercase tracking-wide text-ink-muted transition hover:border-brand hover:text-brand"
              >
                Sign Out
              </button>
            </form>
          </div>
        </div>

        <nav className="flex items-center gap-1 overflow-x-auto border-t border-border px-4 py-1.5 sm:hidden">
          {links(true)}
        </nav>
      </header>

      <main className="flex-1">{children}</main>
    </div>
  );
}

function ShellLink({
  href,
  active,
  icon,
  children,
}: {
  href: string;
  active: boolean;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={
        active
          ? "flex shrink-0 items-center gap-1.5 rounded-full bg-brand px-3.5 py-2 font-headline text-xs font-bold uppercase tracking-wide text-white"
          : "flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-2 font-headline text-xs font-bold uppercase tracking-wide text-ink-muted transition hover:text-brand"
      }
    >
      {icon}
      {children}
    </Link>
  );
}
