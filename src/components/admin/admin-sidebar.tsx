"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { logoutAction } from "@/lib/admin-actions";
import { NavBadge } from "@/components/admin/nav-badge";
import type { AdminBadges } from "@/lib/notifications";
import type { AdminSection } from "@/components/admin/admin-shell";
import {
  canManageOwnArticles,
  canManageUsers,
  canSendNewsletter,
  canViewEnquiries,
  canViewSubscribers,
  ROLE_LABELS,
  type Role,
} from "@/lib/roles";
import {
  BarChart3,
  Inbox,
  LayoutDashboard,
  Mail,
  Menu,
  Newspaper,
  Plus,
  Trophy,
  Users as UsersIcon,
  X,
} from "lucide-react";

type Item = {
  href: string;
  label: string;
  icon: React.ReactNode;
  section: AdminSection;
  badge?: number;
  badgeLabel?: string;
};

export function AdminSidebar({
  user,
  active,
  badges,
}: {
  user: { name: string; email: string; role: string; isSuperAdmin?: boolean };
  active: AdminSection;
  badges?: AdminBadges;
}) {
  const role = user.role as Role;
  const roleLabel = user.isSuperAdmin ? "Super Admin" : (ROLE_LABELS[role] ?? role);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const items: Item[] = [
    {
      href: "/admin",
      label: "Dashboard",
      icon: <LayoutDashboard className="h-4 w-4" />,
      section: "dashboard",
    },
    ...(canManageOwnArticles(role)
      ? [
          {
            href: "/admin/articles/new",
            label: "New Article",
            icon: <Plus className="h-4 w-4" />,
            section: "other" as AdminSection,
          },
        ]
      : []),
    ...(canManageUsers(role)
      ? [
          {
            href: "/admin/users",
            label: "Users",
            icon: <UsersIcon className="h-4 w-4" />,
            section: "users" as AdminSection,
          },
        ]
      : []),
    ...(canViewSubscribers(role)
      ? [
          {
            href: "/admin/subscribers",
            label: "Subscribers",
            icon: <Mail className="h-4 w-4" />,
            section: "subscribers" as AdminSection,
            badge: badges?.newSubscribers,
            badgeLabel: "new subscribers",
          },
        ]
      : []),
    ...(canViewEnquiries(role)
      ? [
          {
            href: "/admin/enquiries",
            label: "Enquiries",
            icon: <Inbox className="h-4 w-4" />,
            section: "enquiries" as AdminSection,
            badge: badges?.unhandledEnquiries,
            badgeLabel: "enquiries awaiting a reply",
          },
        ]
      : []),
    ...(canSendNewsletter(role)
      ? [
          {
            href: "/admin/newsletter",
            label: "Newsletter",
            icon: <Newspaper className="h-4 w-4" />,
            section: "newsletter" as AdminSection,
          },
        ]
      : []),
    ...(user.isSuperAdmin
      ? [
          {
            href: "/admin/analytics",
            label: "Analytics",
            icon: <BarChart3 className="h-4 w-4" />,
            section: "analytics" as AdminSection,
          },
          {
            href: "/admin/staff-ranking",
            label: "Staff Ranking",
            icon: <Trophy className="h-4 w-4" />,
            section: "staff-ranking" as AdminSection,
          },
        ]
      : []),
  ];

  const panel = (
    <div className="bg-sidebar flex h-full w-64 flex-col">
      <div className="border-sidebar-hover flex items-center justify-between border-b px-5 py-4">
        {/* The logo's wordmark is dark by default, so it needs inverting here. */}
        <div className="[&_span:first-child]:text-white">
          <Logo />
        </div>
        <button
          type="button"
          aria-label="Close menu"
          onClick={() => setOpen(false)}
          className="text-sidebar-text hover:text-white lg:hidden"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto py-3">
        {items.map((item) => {
          const isActive = active === item.section && item.section !== "other";
          return (
            <Link
              key={item.href}
              href={item.href}
              // Closing on click rather than watching the pathname: this is a
              // user action, not state that needs syncing to an external system.
              onClick={() => setOpen(false)}
              className={
                isActive
                  ? "bg-brand flex items-center gap-3 px-5 py-2.5 text-sm font-semibold text-white"
                  : "text-sidebar-text hover:bg-sidebar-hover flex items-center gap-3 px-5 py-2.5 text-sm transition hover:text-white"
              }
            >
              {item.icon}
              <span className="flex-1">{item.label}</span>
              {item.badge !== undefined && (
                <NavBadge count={item.badge} label={item.badgeLabel ?? "new"} onBrand={isActive} />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="border-sidebar-hover space-y-3 border-t px-5 py-4">
        <div className="leading-tight">
          <p className="truncate text-sm font-semibold text-white">{user.name}</p>
          <p className="text-brand text-xs font-bold tracking-wide uppercase">{roleLabel}</p>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <form action={logoutAction} className="flex-1">
            <button
              type="submit"
              className="border-sidebar-hover text-sidebar-text w-full rounded-full border px-3 py-2 text-xs font-bold tracking-wide uppercase transition hover:border-white hover:text-white"
            >
              Sign Out
            </button>
          </form>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop: fixed rail. The content column offsets itself with lg:pl-64. */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden lg:block">{panel}</aside>

      {/* Mobile: a slim bar with the menu trigger. */}
      <div className="bg-sidebar sticky top-0 z-30 flex items-center gap-3 px-4 py-3 lg:hidden">
        <button
          type="button"
          aria-label="Open menu"
          onClick={() => setOpen(true)}
          className="text-sidebar-text hover:text-white"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div className="[&_span:first-child]:text-white">
          <Logo />
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-black/50"
          />
          <div className="absolute inset-y-0 left-0">{panel}</div>
        </div>
      )}
    </>
  );
}
