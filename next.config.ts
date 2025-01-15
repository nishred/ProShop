import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["nish-prostore2.s3.us-east-1.amazonaws.com"], // Add the domains from which you'll be serving images
  },
};

export default nextConfig;
