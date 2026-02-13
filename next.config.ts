import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/r/:name",
        destination: "/r/:name.json",
      },
    ];
  },
};

export default nextConfig;
