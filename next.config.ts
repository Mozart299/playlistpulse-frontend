import type { NextConfig } from "next";

  const nextConfig: NextConfig = {
    /* config options here */
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: '**',
        },
  
      ],
      domains: ["http://localhost:3000"],
    },
      reactStrictMode: true,
  };
  
  export default nextConfig;