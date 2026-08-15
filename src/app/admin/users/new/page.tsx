import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { canManageUsers } from "@/lib/roles";
import { AdminShell } from "@/components/admin/admin-shell";
import { UserForm } from "@/components/admin/user-form";
import { createUserAction } from "@/lib/user-actions";

export default async function NewUserPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/admin/login");
  if (!canManageUsers(user.role)) redirect("/admin");

  return (
    <AdminShell user={user} active="users">
      <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
        <h1 className="mb-2 font-headline text-3xl font-extrabold uppercase tracking-tight text-ink">
          New User
        </h1>
        <p className="mb-8 text-sm text-ink-muted">
          Create an account for a member of the KyabiseUG team, or register a subscriber.
        </p>
        <UserForm action={createUserAction} submitLabel="Create Account" />
      </div>
    </AdminShell>
  );
}
