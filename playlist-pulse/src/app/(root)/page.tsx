'use client'

import React, { useState} from 'react';
import Image from 'next/image';
import Link from 'next/link';
import LoginModal from './LoginModal';


const WelcomePage: React.FC = () => {
    const [showModal, setShowModal] = useState(false);
    const openModal = () => {
      setShowModal(true);
    };
    const closeModal = () => {
      setShowModal(false);
    };

  
    return (
      <div className="flex h-screen">
        <div className="w-1/2 flex items-center justify-center">
          <Image src="/images/logo.png" alt="App Logo" width={200} height={200} />
        </div>
        <div className="w-1/2 flex flex-col items-center justify-center p-8">
          <h1 className="text-4xl font-bold mb-4">Welcome to The Playlist</h1>
          <p className="text-xl mb-6 text-center">
            Discover new music, playlists and connect with music lovers.
          </p>
          <div className="flex space-x-4">
            <Link href="/get-started" className="bg-blue-500 text-white px-4 py-2 rounded-md">
              Get Started
            </Link>
            <button onClick={openModal} className="bg-blue-500 text-white px-4 py-2 rounded-md">
              Login
            </button>
          </div>
        </div>
        {showModal && <LoginModal onClose={closeModal} />}
      </div>
    );
  };
  
  
  export default WelcomePage;