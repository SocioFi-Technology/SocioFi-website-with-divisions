import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'standalone',
  // All CMS routes live under /cms/* — mirrors /admin/* in sociofi-website.
  // cms.sociofitechnology.com proxies here; nginx redirects /cms on main domain.
  basePath: '/cms',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
}

export default nextConfig
