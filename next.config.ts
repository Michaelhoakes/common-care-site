import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [{ source: "/conditions", destination: "/areasofcare", permanent: true }];
  },
};

export default nextConfig;
