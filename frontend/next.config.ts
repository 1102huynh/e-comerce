import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    domains: ['localhost', 'res.cloudinary.com'],
  },
  reactStrictMode: true,
  swcMinify: true,
};

export default nextConfig;
