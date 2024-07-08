/** @type {import('next').NextConfig} */
const nextConfig = {
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
    swcMinify: true, // Uses SWC compiler for minification (faster builds)
  };
  
  export default nextConfig;
  