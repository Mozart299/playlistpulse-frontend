"use client"

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import axios from 'axios';

interface Playlist {
  id: string;
  name: string;
  images: { url: string }[];
  external_urls: { spotify: string };
}

export default function AllPlaylists() {
  const { data: session, status } = useSession();
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAllPlaylists = async () => {
      if (session?.accessToken) {
        try {
          setIsLoading(true);
          const response = await axios.get<{ items: Playlist[] }>('https://api.spotify.com/v1/me/playlists', {
            headers: {
              Authorization: `Bearer ${session.accessToken}`,
            },
          });
          setPlaylists(response.data.items);
        } catch (error) {
          console.error('Error fetching playlists:', error);
          setError('Failed to fetch playlists. Please try again later.');
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchAllPlaylists();
  }, [session]);

  const filteredPlaylists = playlists.filter(playlist =>
    playlist.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (status === 'loading' || isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-11 my-14">
      <Link href="/my-profile" className="text-blue-600 hover:underline mb-4 inline-block">
        &larr; Back to Profile
      </Link>
      <h1 className="text-3xl font-bold mb-6">Your Playlists</h1>
      <input
        type="text"
        placeholder="Search playlists..."
        className="w-full p-2 mb-4 border rounded"
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredPlaylists.map((playlist) => (
          <a key={playlist.id} href={playlist.external_urls.spotify} target="_blank" rel="noopener noreferrer" className="relative group">
            <div className="w-full h-48 rounded-lg overflow-hidden">
              <Image src={playlist.images[0]?.url || '/default-playlist.png'} alt={playlist.name} layout="fill" objectFit="cover" className="rounded-lg" />
            </div>
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg">
              <span className="text-white text-center p-2">{playlist.name}</span>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}