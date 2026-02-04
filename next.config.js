/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/api/lhc/:path*',
        destination: 'https://lhc.webplanet.com.br/zap3stor/:path*',
      },
    ]
  },
}

module.exports = nextConfig
