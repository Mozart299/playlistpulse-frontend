import React from 'react';
import Image from 'next/image';
import Link from 'next/link';


const WelcomePage: React.FC = () => {
  return (
    <div className="flex h-screen">
      {/* <div className="w-1/2 flex items-center justify-center bg-gray-200">
        <Image src="/images/logo.png" alt="App Logo" width={200} height={200} />
      </div> */}
      <div className="w-1/2 flex flex-col items-center justify-center p-8">
        <h1 className="text-4xl font-bold mb-4">Welcome to Playlist Pulse</h1>
        <p className="text-xl mb-6 text-center">
          Discover new music, playlists and connect with music lovers.
        </p>
        <div className="flex space-x-4">
          <Link href="/get-started">
            <a className="bg-blue-500 text-white px-4 py-2 rounded-md">Get Started</a>
          </Link>
          <Link href="/login">
            <a className="bg-green-500 text-white px-4 py-2 rounded-md">Login</a>
          </Link>
        </div>
      </div>
    </div>
  );
};


export default WelcomePage;