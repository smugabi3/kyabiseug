import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
