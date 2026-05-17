/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://socialmediaapplication-otsl.onrender.com/:path*', // Your Render URL
      },
    ];
  },
};

export default nextConfig;