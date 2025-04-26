import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import useSpotifyToken from '../utils/useSpotifytoken';

interface Playlist {
  id: string;
  name: string;
  images: { url: string }[];
  external_urls: { spotify: string };
}

interface PlaylistSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPlaylist: (playlist: Playlist) => void;
}

const PlaylistSelectorModal: React.FC<PlaylistSelectorModalProps> = ({
  isOpen,
  onClose,
  onSelectPlaylist
}) => {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [filteredPlaylists, setFilteredPlaylists] = useState<Playlist[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { accessToken, isLoading: isTokenLoading } = useSpotifyToken();

  useEffect(() => {
    if (isOpen && accessToken && !isTokenLoading) {
      fetchPlaylists();
    }
  }, [isOpen, accessToken, isTokenLoading]);

  useEffect(() => {
    if (searchTerm) {
      setFilteredPlaylists(
        playlists.filter(playlist => 
          playlist.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    } else {
      setFilteredPlaylists(playlists);
    }
  }, [searchTerm, playlists]);

  const fetchPlaylists = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await axios.get('https://api.spotify.com/v1/me/playlists', {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
      
      setPlaylists(response.data.items);
      setFilteredPlaylists(response.data.items);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching playlists:', error);
      setError('Failed to load playlists. Please try again.');
      setIsLoading(false);
    }
  };

  const handleSelectPlaylist = (playlist: Playlist) => {
    onSelectPlaylist(playlist);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Select a Playlist</DialogTitle>
          <DialogDescription>
            Choose a playlist you'd like to share with your connections
          </DialogDescription>
        </DialogHeader>
        
        <div className="mb-4 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
          <Input
            type="text"
            placeholder="Search your playlists..."
            className="pl-10 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        {isLoading || isTokenLoading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand"></div>
          </div>
        ) : error ? (
          <div className="text-center py-8 text-red-500">
            <p>{error}</p>
          </div>
        ) : filteredPlaylists.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No playlists found</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 max-h-[400px] overflow-y-auto pr-2">
            {filteredPlaylists.map((playlist) => (
              <div 
                key={playlist.id} 
                className="border rounded-md p-2 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => handleSelectPlaylist(playlist)}
              >
                <div className="aspect-square w-full rounded-md overflow-hidden mb-2">
                  <img 
                    src={playlist.images[0]?.url || '/default-playlist.png'} 
                    alt={playlist.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="font-medium text-sm truncate">{playlist.name}</p>
              </div>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PlaylistSelectorModal;