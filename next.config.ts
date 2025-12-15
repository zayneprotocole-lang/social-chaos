import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },
  // Required for Sanity Studio to work with Next.js
  serverExternalPackages: ['jsdom'],
}

export default nextConfig
