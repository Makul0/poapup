/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['images.unsplash.com', 'api.placeholder.com'],
  },
  experimental: {
    // Properly configure turbo
    turbo: {
      rules: {
        // Configure any specific rules here
      },
    },
  },
  webpack: (config) => {
    config.externals.push('pino-pretty', 'lokijs', 'encoding');
    return config;
  },
}

module.exports = nextConfig