import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { canManageUsers } from "@/lib/roles";
import { AdminShell } from "@/components/admin/admin-shell";
import { getAdminBadges } from "@/lib/notifications";
import { UserForm } from "@/components/admin/user-form";
import { createUserAction } from "@/lib/user-actions";

export default async function NewUserPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/admin/login");

  const badges = await getAdminBadges(user);
  if (!canManageUsers(user.role)) redirect("/admin");

  return (
    <AdminShell user={user} active="users" badges={badges}>
      <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
        <h1 className="font-headline text-ink mb-2 text-3xl font-extrabold tracking-tight uppercase">
          New User
        </h1>
        <p className="text-ink-muted mb-8 text-sm">
          Create an account for a member of the KyabiseUG team, or register a subscriber.
        </p>
        <UserForm action={createUserAction} submitLabel="Create Account" />
      </div>
    </AdminShell>
  );
}
