/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'jjgtakmeqaeguwsarenk.supabase.co',
        port: '',
        pathname: '/storage/v1/object/**', // <-- Add this to match the actual image paths
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      }
    ],
  },
};

export default nextConfig;
