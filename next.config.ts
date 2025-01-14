import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Prevent bundling server-side libraries on the client
      config.resolve.alias['mongodb'] = false;
      config.resolve.alias['mongoose'] = false;
    }
    return config;
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        port: "",
        pathname: "/**", // Update this to match your image path
      },
    ],
  },
};

export default nextConfig;
