/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['images.unsplash.com', 'api.placeholder.com'],
  },
  experimental: {
    turbo: {
      rules: {
      },
    },
  },
  webpack: (config) => {
    config.externals.push('pino-pretty', 'lokijs', 'encoding', 'bigint');
    return config;
  },
}

module.exports = nextConfig