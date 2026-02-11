import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "wrapped.11.ugahacks.com",
      },
    ],
  },
};

export default nextConfig;
