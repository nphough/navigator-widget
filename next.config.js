/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // Enable app directory
    appDir: true,
  },
  async headers() {
    return [
      {
        // Allow embedding in iframes
        source: '/embed',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: 'frame-ancestors *',
          },
        ],
      },
    ];
  },
  images: {
    domains: [
      'imagedelivery.net', // Cloudflare Images
    ],
  },
};

module.exports = nextConfig;