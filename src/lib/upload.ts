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
 * A Blob store can be wired up two ways, and this project shouldn't assume which
 * one a given deployment used:
 *  - BLOB_READ_WRITE_TOKEN: the classic static token.
 *  - BLOB_STORE_ID: set when a store is connected from the Vercel dashboard, which
 *    authenticates via the runtime's auto-refreshed VERCEL_OIDC_TOKEN instead of a
 *    static secret. @vercel/blob resolves that itself as long as no explicit
 *    `token` option is passed to put() — so the fix here is what we *don't* pass,
 *    not new auth code.
 */
function blobConfigured() {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN || process.env.BLOB_STORE_ID);
}

/**
 * Uploads a cover image and returns its public URL.
 *
 * Uses Vercel Blob when a store is configured (either auth scheme above).
 * Otherwise, in development only, falls back to writing into public/uploads/ so
 * the app is usable without provisioning cloud storage first. That fallback
 * deliberately does not run in production — Vercel's filesystem outside /tmp is
 * read-only, so a "successful" write there wouldn't error, it just wouldn't
 * persist or be servable, which is a far more confusing failure than refusing
 * up front.
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

  if (blobConfigured()) {
    try {
      const blob = await put(`articles/${filename}`, file, {
        access: "public",
        addRandomSuffix: true,
      });
      return { url: blob.url };
    } catch (err) {
      return { error: err instanceof Error ? err.message : "Upload to Blob storage failed." };
    }
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
