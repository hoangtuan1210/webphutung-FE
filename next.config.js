/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    domains: ['feichi-api.htechsoft.vn', 'placehold.co'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'feichi-api.htechsoft.vn',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'feichi-api.htechsoft.vn',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'placehold.co',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    qualities: [75, 90, 100],
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

};

module.exports = nextConfig;