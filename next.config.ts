import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Optimize images
  images: {
    unoptimized: false,
    domains: [],
  },
  
  // Enable experimental features
  experimental: {
    optimizeCss: true,
  },
  
  // Compiler options
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
};

export default nextConfig;
