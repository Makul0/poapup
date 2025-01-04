/** @type {import('next').NextConfig} */
const nextConfig = {
  // Image configuration stays the same
  images: {
    domains: [
      'images.unsplash.com',
      'api.placeholder.com',
      'arweave.net',
      'cdn.helius-rpc.com',
      'ipfs.io',
      'nftstorage.link'
    ],
  },
  // Update experimental features configuration
  experimental: {
    // Update serverActions to use the new syntax
    // serverActions: {
    //   bodySizeLimit: '2mb',
    //   allowedOrigins: ['localhost:3000']
    // },
    turbo: {
      rules: {},
    },
  },
  // Rest of your configuration stays the same
  typescript: {
    ignoreBuildErrors: false,
  },
  webpack: (config) => {
    config.externals.push('pino-pretty', 'lokijs', 'encoding');
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
      crypto: require.resolve('crypto-browserify'),
      stream: require.resolve('stream-browserify'),
      url: require.resolve('url'),
      zlib: require.resolve('browserify-zlib'),
      http: require.resolve('stream-http'),
      https: require.resolve('https-browserify'),
      assert: require.resolve('assert'),
      os: require.resolve('os-browserify'),
      path: require.resolve('path-browserify'),
    };
    return config;
  },
  staticPageGenerationTimeout: 180,
}

module.exports = nextConfig