'use client'

import React from 'react';
import { signIn } from 'next-auth/react';

const LoginModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  
  const handleClick = () => {
    const clientId = process.env.SPOTIFY_CLIENT_ID;
    const redirectUrl = process.env.NEXTAUTH_URL;
    const apiUrl = "http://localhost:3000/";
    const scope = [

    ]
  }

  return (
    <div className="fixed z-10 inset-0 flex items-center justify-center">
      <div className="fixed inset-0 bg-black opacity-75" onClick={onClose}></div>
      <div className="bg-white rounded-lg overflow-hidden shadow-xl max-w-md w-full p-4 z-20">
        <div className="flex justify-end">
          <button onClick={onClose} className="text-gray-500 hover:text-gray-600">
            &times;
          </button>
        </div>
        <div className="py-8 px-4 text-center">
          <img src="/images/logo.png" alt="App Logo" className="mx-auto mb-4" style={{ width: '80px' }} />
          <h2 className="text-2xl font-bold mb-4">Get Started</h2>
          <p className="text-sm text-gray-600 mb-4">
            By logging in, you agree to our terms. Read our privacy policy.
          </p>
          <div className="space-y-4">
            <button onClick={handleClick} className="bg-green-500 text-white px-4 py-2 rounded-full w-full flex items-center justify-center hover:bg-green-600" >
              <img src="/assets/spotify.png" alt="Spotify Logo" className="w-6 h-6 mr-2" /> Login with Spotify
            </button>
            <button className="bg-black text-white px-4 py-2 rounded-full w-full flex items-center justify-center hover:bg-gray-800">
              <img src="/assets/apple music.png" alt="Apple Music Logo" className="w-6 h-6 mr-2" /> Login with Apple Music
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
