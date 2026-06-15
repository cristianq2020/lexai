import path from 'node:path';
import type { NextConfig } from 'next';

const apiUrl = process.env['API_URL'] ?? 'http://localhost:4000';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  outputFileTracingRoot: path.join(import.meta.dirname, '../..'),
  transpilePackages: ['@lexai/shared', '@lexai/design-tokens'],
  experimental: {
    optimizePackageImports: ['@lexai/shared', 'lucide-react', 'framer-motion'],
  },
  async rewrites() {
    return [
      {
        source: '/api/trpc/:path*',
        destination: `${apiUrl}/trpc/:path*`,
      },
    ];
  },
};

export default nextConfig;