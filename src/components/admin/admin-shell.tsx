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
import { BarChart3, LayoutDashboard, Mail, Plus, Trophy, Users as UsersIcon } from "lucide-react";
import { IdleLogout } from "@/components/admin/idle-logout";

export function AdminShell({
  user,
  active,
  children,
}: {
  user: { name: string; email: string; role: string; isSuperAdmin?: boolean };
  active: "dashboard" | "users" | "subscribers" | "analytics" | "staff-ranking" | "other";
  children: React.ReactNode;
}) {
  const role = user.role as Role;
  const roleLabel = user.isSuperAdmin ? "Super Admin" : (ROLE_LABELS[role] ?? role);

  const links = (compact: boolean) => (
    <>
      <ShellLink
        href="/admin"
        active={active === "dashboard"}
        icon={<LayoutDashboard className="h-4 w-4" />}
      >
        Dashboard
      </ShellLink>
      {canManageUsers(role) && (
        <ShellLink
          href="/admin/users"
          active={active === "users"}
          icon={<UsersIcon className="h-4 w-4" />}
        >
          Users
        </ShellLink>
      )}
      {canViewSubscribers(role) && (
        <ShellLink
          href="/admin/subscribers"
          active={active === "subscribers"}
          icon={<Mail className="h-4 w-4" />}
        >
          Subscribers
        </ShellLink>
      )}
      {user.isSuperAdmin && (
        <ShellLink
          href="/admin/analytics"
          active={active === "analytics"}
          icon={<BarChart3 className="h-4 w-4" />}
        >
          Analytics
        </ShellLink>
      )}
      {user.isSuperAdmin && (
        <ShellLink
          href="/admin/staff-ranking"
          active={active === "staff-ranking"}
          icon={<Trophy className="h-4 w-4" />}
        >
          Ranking
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
    <div className="bg-surface-alt flex min-h-full flex-1 flex-col">
      <IdleLogout />
      <header className="border-border bg-surface border-b">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-10">
          <div className="flex items-center gap-6">
            <Logo />
            <nav className="hidden items-center gap-1 sm:flex">{links(false)}</nav>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right leading-tight">
              <p className="text-ink text-sm font-semibold">{user.name}</p>
              <p className="text-brand text-xs font-bold tracking-wide uppercase">{roleLabel}</p>
            </div>
            <ThemeToggle />
            <form action={logoutAction}>
              <button
                type="submit"
                className="border-border font-headline text-ink-muted hover:border-brand hover:text-brand rounded-full border px-4 py-2 text-xs font-bold tracking-wide uppercase transition"
              >
                Sign Out
              </button>
            </form>
          </div>
        </div>

        <nav className="border-border flex items-center gap-1 overflow-x-auto border-t px-4 py-1.5 sm:hidden">
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
          ? "bg-brand font-headline flex shrink-0 items-center gap-1.5 rounded-full px-3 py-2 text-xs font-bold tracking-wide text-white uppercase"
          : "font-headline text-ink-muted hover:text-brand flex shrink-0 items-center gap-1.5 rounded-full px-3 py-2 text-xs font-bold tracking-wide uppercase transition"
      }
    >
      {icon}
      {children}
    </Link>
  );
}
