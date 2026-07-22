// FILE: next.config.js
// Optimized for Next.js 16+ Static Export + Hostinger

const nextConfig = {
  output: 'export',           // Static HTML export
  trailingSlash: true,        // Important for Hostinger Apache
  
  images: {
    unoptimized: true,        // Required for static export
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
      { protocol: 'http', hostname: '**' },
    ],
  },

  // Performance & Build Optimizations
  experimental: {
    optimizePackageImports: ['@chakra-ui/react', '@emotion/react', '@emotion/styled', 'framer-motion'],
  },

  // Increase timeout for blog post generation (WordPress fetching)
  staticPageGenerationTimeout: 180,

  // TypeScript & Build Settings
  typescript: {
    ignoreBuildErrors: true,   // Keep for now while developing
  },

  // Recommended for better static export behavior
  poweredByHeader: false,
  compress: true,

  // Generate all static files properly
  generateBuildId: async () => {
    return 'build-' + Date.now()
  },
}

module.exports = nextConfig