import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  images: {
    unoptimized: true,
  },
  // Ensure we keep the repo size small on deployment
  devIndicators: {
    position: 'bottom-right',
  },
  experimental: {
    optimizePackageImports: ["lucide-react", "framer-motion", "three"],
  },
};

export default nextConfig;
