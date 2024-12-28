/** @type {import('next').NextConfig} */
const nextConfig = {
  // Image configuration
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

  // Experimental features
  experimental: {
    turbo: {
      rules: {
        // Add any custom Turbo rules here
      },
    },
  },

  // Webpack configuration
  webpack: (config) => {
    // Exclude packages from the server bundle
    config.externals.push('pino-pretty', 'lokijs', 'encoding');
    
    // Provide Node.js module fallbacks
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

  // Increase build timeout
  staticPageGenerationTimeout: 180,
}

module.exports = nextConfig