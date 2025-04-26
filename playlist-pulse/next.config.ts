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
      reactStrictMode: true, // Enables strict mode for highlighting potential problems in the app
    allowedDevOrigins: [
      "http://localhost:3000",
      "http://localhost:8000",
    ]
  };
  
  export default nextConfig;