// @ts-check

/** @type {import('next').NextConfig} */

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
  env: {
    NEXT_PUBLIC_CPX_APP_ID: process.env.NEXT_PUBLIC_CPX_APP_ID,
    NEXT_PUBLIC_CPX_IFRAME_HASH: process.env.NEXT_PUBLIC_CPX_IFRAME_HASH,
    NEXT_PUBLIC_TIMEWALL_APP_ID: process.env.NEXT_PUBLIC_TIMEWALL_APP_ID,
  }
};

export default nextConfig;
