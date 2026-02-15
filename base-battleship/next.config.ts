import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/.well-known/farcaster.json",
        destination: "/api/farcaster-manifest",
        permanent: false, // 307 — client follows and gets JSON
      },
    ];
  },
};

export default nextConfig;
