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
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist | null>(null);
  const [postContent, setPostContent] = useState('');

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


    const handleShare = (playlist: Playlist) => {
      setSelectedPlaylist(playlist);
      setIsShareModalOpen(true);
    };

    const handlePostSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!selectedPlaylist) return;

      try {
        await axios.post('/api/posts', {
          created_at: new Date().toISOString(),
          content: postContent,
          playlistId: selectedPlaylist.id,
          playlistName: selectedPlaylist.name,
          playlistImage: selectedPlaylist.images[0]?.url,
          playlistUrl: selectedPlaylist.external_urls.spotify,
        });
        setIsShareModalOpen(false);
        setPostContent('');
        setSelectedPlaylist(null);

      } catch (error) {
        console.error('Error sharing playlist:', error);
      }
    };

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
            <div key={playlist.id} className="relative group">
              <a href={playlist.external_urls.spotify} target="_blank" rel="noopener noreferrer" className="block">
                <div className="w-full h-48 rounded-lg overflow-hidden">
                  <Image src={playlist.images[0]?.url || '/default-playlist.png'} alt={playlist.name} layout="fill" objectFit="cover" className="rounded-lg" />
                </div>
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg">
                  <span className="text-white text-center p-2">{playlist.name}</span>
                </div>
              </a>
              <button 
                onClick={() => handleShare(playlist)} 
                className="absolute bottom-2 right-2 bg-brand text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              >
                Share
              </button>
            </div>
          ))}
        </div>
    
        {isShareModalOpen && selectedPlaylist && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-4 rounded-lg w-96">
              <h2 className="text-xl font-bold mb-4">Share {selectedPlaylist.name}</h2>
              <form onSubmit={handlePostSubmit}>
                <textarea
                  value={postContent}
                  onChange={(e) => setPostContent(e.target.value)}
                  placeholder="Write something about this playlist..."
                  className="w-full h-32 p-2 border rounded mb-4"
                />
                <div className="flex justify-end">
                  <button type="button" onClick={() => setIsShareModalOpen(false)} className="mr-2 px-4 py-2 bg-gray-300 rounded">Cancel</button>
                  <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">Share</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  }