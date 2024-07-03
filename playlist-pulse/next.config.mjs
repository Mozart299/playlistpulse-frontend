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
      {
        protocol: 'https',
        hostname: 'mosaic.scdn.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'image-cdn-ak.spotifycdn.com',
        port: '',
        pathname: '/**',
      },

      {
        protocol: 'https',
        hostname: 'daylist.spotifycdn.com',
        port: '',
        pathname: '/**',
      },

      {
        protocol: 'https',
        hostname: 'lexicon-assets.spotifycdn.com',
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
  