import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { canManageUsers, canModifyUser } from "@/lib/roles";
import { AdminShell } from "@/components/admin/admin-shell";
import { UserForm } from "@/components/admin/user-form";
import { updateUserAction } from "@/lib/user-actions";

export default async function EditUserPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user) redirect("/admin/login");
  if (!canManageUsers(user.role)) redirect("/admin");

  const { id } = await params;
  const target = await prisma.user.findUnique({ where: { id } });
  if (!target) notFound();

  // Only the super admin can open its own edit form — block the view, not just the save,
  // so another admin can't even see how it's configured.
  if (!canModifyUser(user, target)) redirect("/admin/users");

  return (
    <AdminShell user={user} active="users">
      <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
        <h1 className="font-headline text-ink mb-2 text-3xl font-extrabold tracking-tight uppercase">
          Edit User
        </h1>
        <p className="text-ink-muted mb-8 text-sm">Updating {target.name}&apos;s account.</p>
        <UserForm
          action={updateUserAction.bind(null, target.id)}
          submitLabel="Save Changes"
          lockRole={target.id === user.id}
          defaults={{ name: target.name, email: target.email, role: target.role }}
        />
      </div>
    </AdminShell>
  );
}
