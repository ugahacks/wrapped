import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "11.ugahacks.com"
      }
    ]
  }
};

export default nextConfig;
