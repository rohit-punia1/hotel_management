/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'photos.hotelbeds.com',
        pathname: '/giata/original/**',
      },
    ],
  },
  
};

export default nextConfig;
