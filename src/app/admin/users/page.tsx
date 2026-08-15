import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { canDeleteUser, canManageUsers, canModifyUser, ROLE_LABELS, type Role } from "@/lib/roles";
import { AdminShell } from "@/components/admin/admin-shell";
import { deleteUserAction } from "@/lib/user-actions";
import { timeAgo } from "@/lib/utils";
import { Pencil, Plus, ShieldCheck } from "lucide-react";

export default async function UsersPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/admin/login");
  if (!canManageUsers(user.role)) redirect("/admin");

  const [users, articleCounts] = await Promise.all([
    prisma.user.findMany({ orderBy: { createdAt: "asc" } }),
    prisma.article.groupBy({ by: ["authorId"], _count: { _all: true } }),
  ]);
  const articleCountByUser = new Map(
    articleCounts.filter((c) => c.authorId).map((c) => [c.authorId as string, c._count._all])
  );

  const adminCount = users.filter((u) => u.role === "admin").length;

  return (
    <AdminShell user={user} active="users">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="font-headline text-3xl font-extrabold uppercase tracking-tight text-ink">
              Team &amp; Access
            </h1>
            <p className="mt-1 text-sm text-ink-muted">
              Create and manage editor, author and subscriber accounts.
            </p>
          </div>
          <Link
            href="/admin/users/new"
            className="flex items-center gap-1.5 rounded-full bg-brand px-4 py-2.5 font-headline text-xs font-bold uppercase tracking-wide text-white transition hover:bg-brand-ink"
          >
            <Plus className="h-4 w-4" />
            New User
          </Link>
        </div>

        <div className="mt-8 overflow-x-auto rounded-xl border border-border bg-surface">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="border-b border-border bg-surface-alt text-xs font-bold uppercase tracking-wide text-ink-muted">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Articles</th>
                <th className="px-4 py-3">Joined</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {users.map((u) => {
                const isSelf = u.id === user.id;
                const isLastAdmin = u.role === "admin" && adminCount <= 1;
                const canEdit = canModifyUser(user, u);
                const canDelete = canDeleteUser(user, u) && !isSelf && !isLastAdmin;
                return (
                  <tr key={u.id}>
                    <td className="px-4 py-3 font-medium text-ink">
                      {u.name}
                      {isSelf && <span className="ml-2 text-xs font-bold text-ink-soft">(you)</span>}
                    </td>
                    <td className="px-4 py-3 text-ink-muted">{u.email}</td>
                    <td className="px-4 py-3">
                      <RoleBadge role={u.role as Role} isSuperAdmin={u.isSuperAdmin} />
                    </td>
                    <td className="px-4 py-3 text-ink-muted">
                      {articleCountByUser.get(u.id) ?? 0}
                    </td>
                    <td className="px-4 py-3 text-ink-muted">{timeAgo(u.createdAt)}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-3 text-xs font-bold uppercase tracking-wide">
                        {canEdit ? (
                          <Link
                            href={`/admin/users/${u.id}/edit`}
                            className="flex items-center gap-1 text-ink-muted hover:text-brand"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                            Edit
                          </Link>
                        ) : (
                          <span className="flex items-center gap-1 text-ink-soft/50" title="Only the super admin can edit this account">
                            <Pencil className="h-3.5 w-3.5" />
                            Edit
                          </span>
                        )}
                        {canDelete ? (
                          <form action={deleteUserAction.bind(null, u.id)}>
                            <button type="submit" className="text-brand hover:text-brand-ink">
                              Delete
                            </button>
                          </form>
                        ) : (
                          <span
                            className="text-ink-soft/50"
                            title={
                              u.isSuperAdmin
                                ? "The super admin account can't be deleted"
                                : isSelf
                                  ? "You can't delete your own account"
                                  : "The last admin can't be deleted"
                            }
                          >
                            Delete
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </AdminShell>
  );
}

function RoleBadge({ role, isSuperAdmin }: { role: Role; isSuperAdmin: boolean }) {
  if (isSuperAdmin) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-gold/20 px-2.5 py-1 text-xs font-bold text-gold-ink">
        <ShieldCheck className="h-3.5 w-3.5" />
        Super Admin
      </span>
    );
  }

  const colors: Record<Role, string> = {
    admin: "bg-brand-tint text-brand",
    editor: "bg-cat-tech/10 text-cat-tech",
    author: "bg-cat-sports/10 text-cat-sports",
    subscriber: "bg-ink-soft/10 text-ink-soft",
  };
  return (
    <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${colors[role]}`}>
      {ROLE_LABELS[role]}
    </span>
  );
}
