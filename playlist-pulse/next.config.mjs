/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.scdn.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
    reactStrictMode: true, // Enables strict mode for highlighting potential problems in the app
    swcMinify: true, // Uses SWC compiler for minification (faster builds)
    // You can add other configurations here
  };
  
  export default nextConfig;
  