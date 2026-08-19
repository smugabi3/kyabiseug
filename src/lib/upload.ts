import { put } from "@vercel/blob";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const MAX_BYTES = 8 * 1024 * 1024; // 8MB
const ALLOWED_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

export type UploadResult = { url: string } | { error: string };

/**
 * Uploads a cover image and returns its public URL.
 *
 * Uses Vercel Blob when BLOB_READ_WRITE_TOKEN is configured. Otherwise, in
 * development only, falls back to writing into public/uploads/ so the app is
 * usable without provisioning cloud storage first. That fallback deliberately
 * does not run in production — Vercel's filesystem outside /tmp is read-only,
 * so a "successful" write there wouldn't error, it just wouldn't persist or be
 * servable, which is a far more confusing failure than refusing up front.
 */
export async function uploadCoverImage(file: File, slugHint: string): Promise<UploadResult> {
  const extension = ALLOWED_TYPES[file.type];
  if (!extension) {
    return { error: "Please upload a JPG, PNG, WEBP or GIF image." };
  }
  if (file.size > MAX_BYTES) {
    return { error: "Image is too large — the limit is 8MB." };
  }

  const filename = `${slugHint}-${Date.now()}.${extension}`;
  const token = process.env.BLOB_READ_WRITE_TOKEN;

  if (token) {
    const blob = await put(`articles/${filename}`, file, {
      access: "public",
      addRandomSuffix: true,
      token,
    });
    return { url: blob.url };
  }

  if (process.env.NODE_ENV === "production") {
    return {
      error:
        "Image uploads aren't configured on this deployment yet. In the Vercel " +
        "dashboard, go to Storage → Create Database → Blob, then redeploy.",
    };
  }

  const dir = path.join(process.cwd(), "public", "uploads");
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, filename), Buffer.from(await file.arrayBuffer()));
  return { url: `/uploads/${filename}` };
}
