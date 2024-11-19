/** @type {import('next').NextConfig} */
import withPWA from "next-pwa";

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
