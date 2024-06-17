// src/pages/profile.tsx
import React from 'react';
import Image from 'next/image';
import TopBar from '../components/TopBar';

const user = {
  name: 'John Doe',
  bio: 'Music lover and playlist curator.',
  profilePicture: '/images/profile-picture.jpg',
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
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center mb-6">
            <Image src={user.profilePicture} alt="Profile Picture" width={100} height={100} className="rounded-full" />
            <div className="ml-4">
              <h1 className="text-3xl font-bold">{user.name}</h1>
              <p className="text-gray-600">{user.bio}</p>
            </div>
          </div>
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
  );
};

export default Profile;
