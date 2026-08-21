import type { NextConfig } from "next";

/**
 * Content Security Policy.
 *
 * `script-src` still allows inline and eval because Next.js injects inline
 * bootstrap scripts (and next-themes writes one to avoid a flash of the wrong
 * theme). Locking that down properly needs per-request nonces, which is a
 * larger change than a security pass should smuggle in — so this policy
 * concentrates on the directives that pay off without that work:
 * `frame-ancestors` blocks clickjacking, `object-src` blocks legacy plugin
 * embeds, and `base-uri` stops an injected <base> tag rewriting every relative
 * URL on the page.
 */
const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' data: https://fonts.gstatic.com",
  // Article covers come from Vercel Blob and picsum; data: covers the inline
  // previews the composer generates before an upload finishes.
  "img-src 'self' data: blob: https:",
  "media-src 'self' https:",
  "connect-src 'self' https:",
  // Video articles embed YouTube.
  "frame-src https://www.youtube.com https://www.youtube-nocookie.com",
  "form-action 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "frame-ancestors 'none'",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  // Redundant with frame-ancestors for modern browsers, kept for older ones.
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
];

const nextConfig: NextConfig = {
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
  experimental: {
    serverActions: {
      // Next.js defaults Server Action request bodies to 1MB, well under the 8MB
      // cover-image limit enforced in src/lib/upload.ts. 10MB leaves headroom for
      // multipart/form-data overhead plus the other article fields in the same request.
      bodySizeLimit: "10mb",
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
      {
        protocol: "https",
        hostname: "fastly.picsum.photos",
      },
      {
        // Uploaded article cover images.
        protocol: "https",
        hostname: "*.public.blob.vercel-storage.com",
      },
    ],
  },
};

export default nextConfig;
