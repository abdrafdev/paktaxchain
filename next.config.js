/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: false,
  images: {
    domains: ['paktaxchain.com', 'ipfs.io'],
  },
}

module.exports = nextConfig
