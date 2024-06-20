// src/pages/profile.tsx
import React from 'react';
import Image from 'next/image';
import TopBar from './components/TopBar';

const user = {
  name: 'Jane Doe',
  followers: 34554,
  profilePicture: '/images/profile-picture.jpg',
  bannerImage: '/images/banner-image.jpg',
  playlists: [
    { id: 1, name: 'Chill Vibes', coverImage: '/images/playlist1.jpg' },
    { id: 2, name: 'Workout Mix', coverImage: '/images/playlist2.jpg' },
    { id: 3, name: 'Focus Beats', coverImage: '/images/playlist3.jpg' },
    { id: 4, name: 'Top Hits', coverImage: '/images/playlist4.jpg' },
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
          </div>
          <div className="relative flex items-center pb-2 bg-white rounded-lg">
            <div className="relative -mt-16">
              <Image src={user.profilePicture} alt="Profile Picture" width={120} height={120} className="rounded-full border-4 border-white" />
            </div>
            <div className="ml-4">
              <h1 className="text-3xl font-bold">{user.name}</h1>
              <p className="text-lg">{user.followers.toLocaleString()} followers</p>
            </div>
            <div className="ml-auto space-x-4 flex items-center">
              <button className="bg-blue-500 text-white px-4 py-2 rounded-md">Connect</button>
              <button className="bg-green-500 text-white px-4 py-2 rounded-md">Chat</button>
            </div>
          </div>
          <div className="flex space-x-8 mt-4">
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
        <div className="bg-white rounded-lg py-8 mb-8">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-200 mr-20 p-6 rounded-lg">
              <h3 className="text-x font-bold mb-2">User Info</h3>
              <div className="space-y-2">
                <button className="bg-gray-300 p-2 rounded-md w-full text-center">Add bio</button>
                <button className="bg-gray-300 p-2 rounded-md w-full text-center">Edit Profile</button>
                <button className="bg-gray-300 p-2 rounded-md w-full text-center">Add interests</button>
              </div>
            </div>
            <div className="bg-gray-200 p-6 rounded-lg">Content 2</div>
            <div className="bg-gray-300 mr-20 p-6 rounded-lg">
              <h3 className="text-x font-bold mb-2">Shared Playlists</h3>
              <div className="grid grid-cols-2 gap-2">
                {user.playlists.map((playlist) => (
                  <div key={playlist.id} className="relative group">
                    <div className="w-full h-32 rounded-lg overflow-hidden">
                      <Image src={playlist.coverImage} alt={playlist.name} layout="fill" objectFit="cover" className="rounded-lg" />
                    </div>
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg">
                      <span className="text-white text-center">{playlist.name}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-gray-300 p-6 rounded-lg">Content 4</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
