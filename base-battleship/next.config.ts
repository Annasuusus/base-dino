import type { NextConfig } from "next";

// Vercel блокує rewrite/redirect для .well-known — тільки статичний файл з public/
const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/.well-known/farcaster.json",
        headers: [
          { key: "Content-Type", value: "application/json" },
          { key: "Access-Control-Allow-Origin", value: "*" },
        ],
      },
    ];
  },
};

export default nextConfig;
