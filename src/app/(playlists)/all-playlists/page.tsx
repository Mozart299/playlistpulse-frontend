"use client"

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import axios from 'axios'
import Link from 'next/link'
import TopBar from '@/app/components/TopBar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ArrowLeft, Search } from 'lucide-react'
import PlaylistGrid from '@/app/components/PlaylistGrid' 
import SharePlaylistModal from '@/app/components/SharePlaylistModal'

interface Playlist {
  id: string
  name: string
  images: { url: string }[]
  external_urls: { spotify: string }
}

export default function AllPlaylists() {
  const { data: session, status } = useSession()
  const [playlists, setPlaylists] = useState<Playlist[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [isShareModalOpen, setIsShareModalOpen] = useState(false)
  const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist | null>(null)

  useEffect(() => {
    const fetchAllPlaylists = async () => {
      if (session?.accessToken) {
        try {
          setIsLoading(true)
          const response = await axios.get<{ items: Playlist[] }>('https://api.spotify.com/v1/me/playlists', {
            headers: {
              Authorization: `Bearer ${session.accessToken}`,
            },
          })
          setPlaylists(response.data.items)
        } catch (error) {
          console.error('Error fetching playlists:', error)
          setError('Failed to fetch playlists. Please try again later.')
        } finally {
          setIsLoading(false)
        }
      }
    }

    fetchAllPlaylists()
  }, [session])

  const filteredPlaylists = playlists.filter(playlist =>
    playlist.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleShare = (playlist: Playlist) => {
    setSelectedPlaylist(playlist)
    setIsShareModalOpen(true)
  }

  const handleShareSuccess = () => {
    // Show success message or notification
    console.log('Playlist shared successfully!')
  }

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-brand border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600">Loading your playlists...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md text-center">
          <div className="text-red-500 mb-4 text-5xl">!</div>
          <h2 className="text-xl font-semibold mb-2">Error Loading Playlists</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <TopBar />
      
      <div className="container mx-auto px-4 pt-24 pb-10">
        <div className="flex items-center mb-6">
          <Link href="/my-profile" className="mr-4">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">Your Playlists</h1>
        </div>
        
        <div className="mb-6 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
          <Input
            type="text"
            placeholder="Search playlists..."
            className="pl-10 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        {filteredPlaylists.length > 0 ? (
          <PlaylistGrid 
            playlists={filteredPlaylists} 
            onShare={handleShare}
            showShareButton={true}
          />
        ) : (
          <div className="text-center py-16">
            <p className="text-gray-500 mb-4">No playlists found</p>
            {searchTerm ? (
              <Button variant="outline" onClick={() => setSearchTerm('')}>
                Clear Search
              </Button>
            ) : (
              <a href="https://open.spotify.com/create-playlist" target="_blank" rel="noopener noreferrer">
                <Button>Create a Playlist on Spotify</Button>
              </a>
            )}
          </div>
        )}
      </div>
      
      {/* Share Playlist Modal */}
      <SharePlaylistModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        playlist={selectedPlaylist}
        onShareSuccess={handleShareSuccess}
      />
    </div>
  )
}