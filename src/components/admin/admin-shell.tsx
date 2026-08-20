import { IdleLogout } from "@/components/admin/idle-logout";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import type { AdminBadges } from "@/lib/notifications";

export type AdminSection =
  | "dashboard"
  | "users"
  | "subscribers"
  | "enquiries"
  | "newsletter"
  | "analytics"
  | "staff-ranking"
  | "other";

export function AdminShell({
  user,
  active,
  badges,
  children,
}: {
  user: { name: string; email: string; role: string; isSuperAdmin?: boolean };
  active: AdminSection;
  badges?: AdminBadges;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-surface-alt min-h-full flex-1">
      <IdleLogout />
      <AdminSidebar user={user} active={active} badges={badges} />
      {/* Offsets the fixed sidebar on desktop; on mobile the sidebar is a drawer
          so no offset is needed. */}
      <div className="lg:pl-64">
        <main>{children}</main>
      </div>
    </div>
  );
}
