/** @type {import('next').NextConfig} */
const nextConfig = {
  // Remove: output: 'export'
  // Keep everything else
  images: { 
    unoptimized: true,
    // Can be optimized now that we're using Node.js
    domains: ['http://web3farmyard.com/cms'],
  },
}

module.exports = nextConfig