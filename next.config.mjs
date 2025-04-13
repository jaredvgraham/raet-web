/** @type {import('next').NextConfig} */
import withPWA from "next-pwa";

const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: [
      "ul0rw9se046nebaq.public.blob.vercel-storage.com",
      "raet-bucket.s3.us-east-2.amazonaws.com",
    ],
  },
};

export default nextConfig;
