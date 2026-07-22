import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: [
    "@deepn/auth",
    "@deepn/audit",
    "@deepn/config",
    "@deepn/database",
    "@deepn/errors",
    "@deepn/feature-flags",
    "@deepn/security",
    "@deepn/types",
  ],
  experimental: {
    serverActions: { bodySizeLimit: "2mb" },
  },
};

export default nextConfig;
