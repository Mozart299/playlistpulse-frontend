// src/pages/profile.tsx
import React from 'react';
import Image from 'next/image';
import TopBar from '../components/TopBar';

const user = {
  name: 'Jane Doe',
  followers: 34554,
  profilePicture: '/images/profile-picture.jpg',
  bannerImage: '/images/banner-image.jpg',
  playlists: [
    { id: 1, name: 'Chill Vibes', description: 'Relaxing and soothing tracks.', coverImage: '/images/playlist1.png' },
    { id: 2, name: 'Workout Mix', description: 'High-energy tracks to boost your workout.', coverImage: '/images/playlist2.png' },
    // Add more playlists as needed
  ],
};

const Profile: React.FC = () => {
  return (
    <div>
      <TopBar />
      <div className="container mx-auto p-4">
        <div className="bg-white rounded-lg shadow-md p-4 mb-8">
          <div className="relative h-64 rounded-lg overflow-hidden mb-4">
            <Image src={user.bannerImage} alt="Banner" layout="fill" objectFit="cover" className="w-full h-full object-cover" />
            <div className="absolute inset-0 flex items-end p-4 bg-gradient-to-t from-black via-transparent to-transparent rounded-lg">
              <div className="relative flex items-center space-x-4">
                <div className="relative -mb-20">
                  <Image src={user.profilePicture} alt="Profile Picture" width={120} height={120} className="rounded-full border-4 border-white" />
                </div>
                <div className="text-white">
                  <h1 className="text-3xl font-bold">{user.name}</h1>
                  <p className="text-lg">{user.followers.toLocaleString()} followers</p>
                </div>
              </div>
              <div className="ml-auto space-x-4 flex items-center">
                <button className="bg-blue-500 text-white px-4 py-2 rounded-md">Connect</button>
                <button className="bg-green-500 text-white px-4 py-2 rounded-md">Chat</button>
              </div>
            </div>
          </div>
          <div className="flex space-x-8">
            <button className="flex items-center space-x-2 bg-blue-500 px-4 py-2 text-white rounded-md">
              <img src="/images/share-icon.png" alt="Share" className="w-5 h-5" />
              <span>Share</span>
            </button>
            <button className="flex items-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded-md">
              <img src="/images/profile-icon.png" alt="Profile" className="w-5 h-5" />
              <span>Profile</span>
            </button>
            <button className="flex items-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded-md">
              <img src="/images/playlists-icon.png" alt="Playlists" className="w-5 h-5" />
              <span>Playlists</span>
            </button>
            <button className="flex items-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded-md">
              <img src="/images/messages-icon.png" alt="Messages" className="w-5 h-5" />
              <span>Messages</span>
            </button>
            <button className="flex items-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded-md">
              <img src="/images/connections-icon.png" alt="Connections" className="w-5 h-5" />
              <span>Connections</span>
            </button>
          </div>
        </div>
        <div className="min-h-screen bg-gray-100 p-8">
          <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-4">Favorite Playlists</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {user.playlists.map((playlist) => (
                <div key={playlist.id} className="bg-gray-50 p-4 rounded-lg shadow-sm flex items-center">
                  <Image src={playlist.coverImage} alt={playlist.name} width={60} height={60} className="rounded-lg" />
                  <div className="ml-4">
                    <h3 className="text-xl font-semibold">{playlist.name}</h3>
                    <p className="text-gray-500">{playlist.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
