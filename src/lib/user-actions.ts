"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser, hashPassword } from "@/lib/auth";
import { canDeleteUser, canManageUsers, canModifyUser, isRole } from "@/lib/roles";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

async function requireAdmin() {
  const user = await getCurrentUser();
  if (!user) redirect("/admin/login");
  if (!canManageUsers(user.role)) redirect("/admin");
  return user;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function createUserAction(
  _prevState: { error?: string } | undefined,
  formData: FormData
): Promise<{ error?: string }> {
  await requireAdmin();

  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  const password = String(formData.get("password") ?? "");
  const role = String(formData.get("role") ?? "");

  if (!name || !email || !password || !role) {
    return { error: "All fields are required." };
  }
  if (!EMAIL_RE.test(email)) {
    return { error: "Please enter a valid email address." };
  }
  if (password.length < 8) {
    return { error: "Password must be at least 8 characters." };
  }
  if (!isRole(role)) {
    return { error: "Please choose a valid role." };
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return { error: "An account with that email already exists." };
  }

  await prisma.user.create({
    data: { name, email, role, password: await hashPassword(password) },
  });

  revalidatePath("/admin/users");
  redirect("/admin/users");
}

export async function updateUserAction(
  id: string,
  _prevState: { error?: string } | undefined,
  formData: FormData
): Promise<{ error?: string }> {
  const admin = await requireAdmin();

  const target = await prisma.user.findUnique({ where: { id } });
  if (!target) return { error: "That account no longer exists." };
  if (!canModifyUser(admin, target)) {
    return { error: "This is the super admin account — only it can edit itself." };
  }

  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  const password = String(formData.get("password") ?? "");
  const role = String(formData.get("role") ?? "");

  if (!name || !email || !role) {
    return { error: "Name, email and role are required." };
  }
  if (!EMAIL_RE.test(email)) {
    return { error: "Please enter a valid email address." };
  }
  if (!isRole(role)) {
    return { error: "Please choose a valid role." };
  }
  if (password && password.length < 8) {
    return { error: "Password must be at least 8 characters." };
  }
  if (target.id === admin.id && role !== "admin") {
    return { error: "You cannot remove your own admin role. Ask another admin to do it." };
  }

  const emailOwner = await prisma.user.findUnique({ where: { email } });
  if (emailOwner && emailOwner.id !== target.id) {
    return { error: "An account with that email already exists." };
  }

  await prisma.user.update({
    where: { id },
    data: {
      name,
      email,
      role,
      ...(password ? { password: await hashPassword(password) } : {}),
    },
  });

  revalidatePath("/admin/users");
  redirect("/admin/users");
}

export async function deleteUserAction(id: string) {
  const admin = await requireAdmin();
  if (id === admin.id) return; // cannot delete your own account

  const target = await prisma.user.findUnique({ where: { id } });
  if (!target) return;
  if (!canDeleteUser(admin, target)) return; // super admin can never be deleted

  if (target.role === "admin") {
    const adminCount = await prisma.user.count({ where: { role: "admin" } });
    if (adminCount <= 1) return; // never delete the last remaining admin
  }

  // Detach (don't cascade-delete) any articles bylined to this user so their
  // published work survives account removal, same as the seeded legacy content.
  await prisma.article.updateMany({ where: { authorId: id }, data: { authorId: null } });
  await prisma.user.delete({ where: { id } });

  revalidatePath("/admin/users");
  revalidatePath("/admin");
}
