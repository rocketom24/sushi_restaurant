import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Default Server Action body limit is 1MB — too small for photo
    // uploads (menu items, hero slides). Raised to fit a ~8MB image
    // plus multipart overhead.
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
};

export default nextConfig;
