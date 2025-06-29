import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Share, Play } from 'lucide-react'
import { cn } from '@/lib/utils'

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
          <Card key={playlist.id} className={cn(
            "overflow-hidden group transition-all duration-300 ease-out",
            "hover:-translate-y-1 hover:shadow-lg hover:shadow-brand-primary/10",
            "border-border/50 hover:border-brand-primary/30"
          )}>
            <CardContent className="p-3">
              <div className="aspect-square rounded-lg overflow-hidden relative mb-3 group/image">
                <a 
                  href={playlist.external_urls.spotify} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block w-full h-full"
                  aria-label={`Open ${playlist.name} playlist on Spotify`}
                >
                  <Image 
                    src={playlist.images[0]?.url || '/default-playlist.png'} 
                    alt={`${playlist.name} playlist cover`} 
                    layout="fill" 
                    objectFit="cover"
                    className="transition-transform duration-500 ease-out group-hover/image:scale-110"
                  />
                  
                  {/* Enhanced hover overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover/image:opacity-100 transition-all duration-300 flex items-center justify-center">
                    <div className="flex flex-col items-center space-y-2 transform translate-y-4 group-hover/image:translate-y-0 transition-transform duration-300">
                      <Button
                        size="icon"
                        className="w-12 h-12 rounded-full bg-brand-primary hover:bg-brand-secondary text-white shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-200"
                        aria-label={`Play ${playlist.name}`}
                      >
                        <Play className="h-5 w-5" />
                      </Button>
                      <p className="text-white text-xs font-medium text-center px-2">
                        {playlist.name}
                      </p>
                    </div>
                  </div>
                </a>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm text-foreground truncate mb-1">
                    {playlist.name}
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    Spotify Playlist
                  </p>
                </div>
                
                {showShareButton && onShare && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 ml-2 hover:bg-brand-light hover:text-brand-primary transition-colors duration-200"
                    onClick={() => onShare(playlist)}
                    aria-label={`Share ${playlist.name} playlist`}
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