import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Share } from 'lucide-react'

interface Playlist {
  id: string
  name: string
  images: { url: string }[]
  external_urls: { spotify: string }
}

interface PlaylistGridProps {
  playlists: Playlist[]
  onShare?: (playlist: Playlist) => void
  showShareButton?: boolean
  title?: string
  showViewAll?: boolean
  viewAllLink?: string
  columnCount?: number
}

const PlaylistGrid: React.FC<PlaylistGridProps> = ({
  playlists,
  onShare,
  showShareButton = false,
  title,
  showViewAll = false,
  viewAllLink = '/all-playlists',
  columnCount = 4
}) => {
  if (!playlists || playlists.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No playlists available
      </div>
    )
  }

  const gridColsClass = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
  }[columnCount] || 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'

  return (
    <div>
      {(title || showViewAll) && (
        <div className="flex justify-between items-center mb-4">
          {title && <h3 className="text-xl font-bold">{title}</h3>}
          
          {showViewAll && (
            <Link href={viewAllLink} className="text-blue-600 hover:underline text-sm">
              View All
            </Link>
          )}
        </div>
      )}
      
      <div className={`grid ${gridColsClass} gap-4`}>
        {playlists.map((playlist) => (
          <Card key={playlist.id} className="overflow-hidden group">
            <CardContent className="p-3">
              <div className="aspect-square rounded-md overflow-hidden relative mb-2">
                <a 
                  href={playlist.external_urls.spotify} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block w-full h-full"
                >
                  <Image 
                    src={playlist.images[0]?.url || '/default-playlist.png'} 
                    alt={playlist.name} 
                    layout="fill" 
                    objectFit="cover"
                    className="transition-transform duration-300 group-hover:scale-105"
                  />
                  
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-opacity duration-300 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-white text-center p-2">
                      <p className="font-medium">{playlist.name}</p>
                    </div>
                  </div>
                </a>
              </div>
              
              <div className="flex justify-between items-center">
                <h4 className="font-medium text-sm truncate">
                  {playlist.name}
                </h4>
                
                {showShareButton && onShare && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => onShare(playlist)}
                  >
                    <Share className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default PlaylistGrid