import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '20mb',
    },
    // Resolve cross-origin warnings in Firebase Studio / Cloud Workstations
    allowedDevOrigins: [
      '6000-firebase-studio-1770525723267.cluster-feoix4uosfhdqsuxofg5hrq6vy.cloudworkstations.dev',
      '9000-firebase-studio-1770525723267.cluster-feoix4uosfhdqsuxofg5hrq6vy.cloudworkstations.dev',
    ],
  },
};

export default nextConfig;
