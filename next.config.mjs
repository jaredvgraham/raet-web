/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: [
      "ul0rw9se046nebaq.public.blob.vercel-storage.com", // Add your domain here
      // Add other domains if needed
    ],
  },
};

export default nextConfig;
