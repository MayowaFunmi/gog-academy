import type { NextConfig } from "next";

const domain = process.env.NEXT_PUBLIC_HOST;
const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "3000",
        pathname: `${domain}/public/uploads/**`,
      },
    ]
  }
};

export default nextConfig;
