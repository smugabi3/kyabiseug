"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth";
import { canViewEnquiries } from "@/lib/roles";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Max submissions accepted from one email address within the window below. */
const RATE_LIMIT_MAX = 3;
const RATE_LIMIT_WINDOW_MINUTES = 30;

export type EnquiryState = { ok?: boolean; error?: string };

const LIMITS = {
  name: 120,
  email: 200,
  phone: 40,
  company: 160,
  budget: 80,
  message: 4000,
} as const;

function clean(value: FormDataEntryValue | null, max: number) {
  return String(value ?? "")
    .trim()
    .slice(0, max);
}

/**
 * Spam handling, without collecting anything extra about the sender.
 *
 * The honeypot is a field positioned off-screen: a human never sees it, so any
 * submission that fills it in is automated and is silently accepted-but-discarded
 * (returning an error would tell a bot what tripped it).
 *
 * Rate limiting counts recent rows for the same email address rather than by IP.
 * IP-based limiting would be stricter, but this site deliberately stores no IP
 * addresses — the Privacy Policy says so — and quietly starting to log them for
 * rate limiting would make that statement untrue.
 */
async function isRateLimited(email: string) {
  const since = new Date(Date.now() - RATE_LIMIT_WINDOW_MINUTES * 60 * 1000);
  const recent = await prisma.enquiry.count({
    where: { email, createdAt: { gte: since } },
  });
  return recent >= RATE_LIMIT_MAX;
}

async function submit(
  kind: "contact" | "advertise",
  formData: FormData,
  build: (fd: FormData) => { error?: string; data?: Record<string, string | null> }
): Promise<EnquiryState> {
  // Honeypot: silently pretend it worked.
  if (clean(formData.get("website"), 200)) return { ok: true };

  const name = clean(formData.get("name"), LIMITS.name);
  const email = clean(formData.get("email"), LIMITS.email).toLowerCase();
  const message = clean(formData.get("message"), LIMITS.message);

  if (!name || !email || !message) {
    return { error: "Please fill in all required fields." };
  }
  if (!EMAIL_RE.test(email)) {
    return { error: "Please enter a valid email address." };
  }

  const extra = build(formData);
  if (extra.error) return { error: extra.error };

  if (await isRateLimited(email)) {
    return {
      error: "You've sent several messages recently. Please give us a little time to reply.",
    };
  }

  try {
    await prisma.enquiry.create({
      data: { kind, name, email, message, ...extra.data },
    });
  } catch {
    return { error: "Something went wrong sending your message. Please try again." };
  }

  revalidatePath("/admin/enquiries");
  return { ok: true };
}

export async function submitContactAction(
  _prev: EnquiryState | undefined,
  formData: FormData
): Promise<EnquiryState> {
  return submit("contact", formData, (fd) => ({
    data: { phone: clean(fd.get("phone"), LIMITS.phone) || null },
  }));
}

export async function submitAdvertiseAction(
  _prev: EnquiryState | undefined,
  formData: FormData
): Promise<EnquiryState> {
  return submit("advertise", formData, (fd) => {
    const phone = clean(fd.get("phone"), LIMITS.phone);
    const company = clean(fd.get("company"), LIMITS.company);
    const advertType = clean(fd.get("advertType"), 40);

    if (!phone) return { error: "Please include a phone number so we can reach you." };
    if (!company) return { error: "Please tell us your company or organisation." };

    return {
      data: {
        phone,
        company,
        advertType: advertType || null,
        budget: clean(fd.get("budget"), LIMITS.budget) || null,
      },
    };
  });
}

/**
 * Admin-only. Server actions are publicly callable endpoints, so this must check
 * the caller itself — being reachable only from an admin page is not a control.
 */
export async function toggleEnquiryHandledAction(id: string) {
  const user = await getCurrentUser();
  if (!user || !canViewEnquiries(user.role)) return;

  const enquiry = await prisma.enquiry.findUnique({ where: { id } });
  if (!enquiry) return;
  await prisma.enquiry.update({ where: { id }, data: { handled: !enquiry.handled } });
  revalidatePath("/admin/enquiries");
}
