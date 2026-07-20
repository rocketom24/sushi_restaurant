import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Default Server Action body limit is 1MB — too small for photo
    // uploads (menu items, hero slides). Raised to fit up to a 25MB
    // raw image plus multipart overhead; images are compressed to
    // under 200KB server-side before being stored (see upload.actions.ts).
    serverActions: {
      bodySizeLimit: "27mb",
    },
  },
};

export default nextConfig;
