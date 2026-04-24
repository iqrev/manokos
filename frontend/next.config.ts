import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
        pathname: '/storage/**',
      },
    ],
  },
  // Enable compression and performance optimizations
  compress: true,
  // Strict mode for better development experience
  reactStrictMode: true,
};

export default nextConfig;
