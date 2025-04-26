"use client"

import React, { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import axios from 'axios'
import Link from 'next/link'
import Image from 'next/image'
import TopBar from '@/app/components/TopBar'
import PostItem from '@/app/components/PostItem'
import CreatePost from '@/app/components/CreatePost'
import PlaylistGrid from '@/app/components/PlaylistGrid'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { MessageSquare, Mail, UserPlus, Settings } from 'lucide-react'

const ProfilePage: React.FC = () => {
  const { data: session, status } = useSession()
  const [playlists, setPlaylists] = useState<any[]>([])
  const [posts, setPosts] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState('posts')

  useEffect(() => {
    const fetchPlaylists = async () => {
      if (session?.accessToken) {
        try {
          const response = await axios.get('https://api.spotify.com/v1/me/playlists', {
            headers: {
              Authorization: `Bearer ${session.accessToken}`,
            },
          })
          setPlaylists(response.data.items)
        } catch (error) {
          console.error('Error fetching playlists:', error)
        }
      }
    }

    const fetchPosts = async () => {
      try {
        const response = await axios.get('/api/posts')
        setPosts(response.data)
      } catch (error) {
        console.error('Error fetching posts:', error)
      }
    }

    fetchPlaylists()
    fetchPosts()
  }, [session])

  const handlePostSubmit = async (postData: any) => {
    try {
      const response = await axios.post('/api/posts', postData)
      setPosts(prevPosts => [response.data, ...prevPosts])
      return response.data
    } catch (error) {
      console.error('Error creating post:', error)
      throw error
    }
  }

  // Shuffle function for featured playlists
  const shuffleArray = (array: any[]) => {
    const newArray = [...array]
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[newArray[i], newArray[j]] = [newArray[j], newArray[i]]
    }
    return newArray
  }

  // Get featured playlists (random 4)
  const featuredPlaylists = playlists.length > 0
    ? shuffleArray([...playlists]).slice(0, 4)
    : []

  if (status === 'loading') {
    return <div className="flex items-center justify-center h-screen">Loading...</div>
  }

  if (!session) {
    return <div className="flex items-center justify-center h-screen">Not authenticated</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <TopBar />
      
      <div className="container mx-auto px-4 pt-24 pb-10">
        {/* Profile Header */}
        <div className="relative mb-8">
          <div className="h-48 rounded-lg overflow-hidden">
            <Image 
              src="/images/banner-image.jpg" 
              alt="Profile Banner" 
              layout="fill" 
              objectFit="cover" 
              className="w-full"
            />
          </div>
          
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between -mt-16 md:-mt-12 relative z-10 px-4">
            <div className="flex flex-col md:flex-row items-center md:items-end">
              <div className="rounded-full border-4 border-white overflow-hidden h-32 w-32 bg-white">
                <Image 
                  src={session.user?.image || '/default-avatar.png'} 
                  alt="Profile Picture" 
                  width={128} 
                  height={128} 
                  className="rounded-full"
                />
              </div>
              
              <div className="md:ml-4 mt-4 md:mt-0 text-center md:text-left">
                <h1 className="text-2xl font-bold">{session.user?.name}</h1>
                <p className="text-gray-600">Music enthusiast</p>
              </div>
            </div>
            
            <div className="flex space-x-2 mt-4 md:mt-0">
              <Button>
                <UserPlus className="h-4 w-4 mr-2" />
                Connect
              </Button>
              <Button variant="outline">
                <MessageSquare className="h-4 w-4 mr-2" />
                Message
              </Button>
            </div>
          </div>
          
          <div className="flex justify-between items-center px-4 mt-6">
            <div className="flex space-x-6">
              <div>
                <span className="font-bold">124</span> <span className="text-gray-600">Posts</span>
              </div>
              <div>
                <span className="font-bold">1.2K</span> <span className="text-gray-600">Connections</span>
              </div>
              <div>
                <span className="font-bold">{playlists.length}</span> <span className="text-gray-600">Playlists</span>
              </div>
            </div>
            
            <div className="hidden md:block">
              <Link href="/settings">
                <Button variant="ghost" size="sm">
                  <Settings className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
              </Link>
            </div>
          </div>
        </div>
        
        {/* Profile Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="md:col-span-2">
            <Tabs defaultValue="posts" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger value="posts">Posts</TabsTrigger>
                <TabsTrigger value="playlists">Playlists</TabsTrigger>
                <TabsTrigger value="about">About</TabsTrigger>
              </TabsList>
              
              <TabsContent value="posts" className="space-y-4">
                <CreatePost 
                  userImage={session.user?.image || ''}
                  userName={session.user?.name || ''}
                  onPostSubmit={handlePostSubmit}
                />
                
                {posts.length > 0 ? (
                  posts.map((post) => (
                    <PostItem
                      key={post._id}
                      post={post}
                      userImage={session.user?.image as string}
                    />
                  ))
                ) : (
                  <Card>
                    <CardContent className="flex flex-col items-center justify-center py-10">
                      <p className="text-gray-500 mb-4">No posts yet</p>
                      <p className="text-sm text-gray-400">Share your music journey with others</p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
              
              <TabsContent value="playlists">
                <Card>
                  <CardHeader>
                    <CardTitle>Your Playlists</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {playlists.length > 0 ? (
                      <PlaylistGrid 
                        playlists={playlists} 
                        showShareButton={true} 
                        onShare={(playlist) => {
                          console.log('Share playlist:', playlist)
                          // Implement share functionality
                        }}
                        columnCount={3}
                      />
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-gray-500 mb-2">No playlists found</p>
                        <Link href="https://open.spotify.com/create-playlist" target="_blank" rel="noopener noreferrer">
                          <Button variant="outline" size="sm">Create a Playlist</Button>
                        </Link>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="about">
                <Card>
                  <CardHeader>
                    <CardTitle>About</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h3 className="font-medium text-sm text-gray-500 mb-1">Bio</h3>
                      <p>
                        Music lover and playlist curator. Always on the lookout for new sounds and artists to share.
                      </p>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h3 className="font-medium text-sm text-gray-500 mb-1">Interests</h3>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <div className="bg-gray-100 px-3 py-1 rounded-full text-sm">Indie Rock</div>
                        <div className="bg-gray-100 px-3 py-1 rounded-full text-sm">Electronic</div>
                        <div className="bg-gray-100 px-3 py-1 rounded-full text-sm">Jazz</div>
                        <div className="bg-gray-100 px-3 py-1 rounded-full text-sm">Hip Hop</div>
                        <div className="bg-gray-100 px-3 py-1 rounded-full text-sm">Classical</div>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h3 className="font-medium text-sm text-gray-500 mb-1">Contact</h3>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Mail className="h-4 w-4" />
                        <span>{session.user?.email}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
          
          {/* Sidebar */}
          <div className="space-y-6">
            {/* Featured Playlists */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Featured Playlists</CardTitle>
              </CardHeader>
              <CardContent>
                {featuredPlaylists.length > 0 ? (
                  <PlaylistGrid 
                    playlists={featuredPlaylists} 
                    columnCount={2}
                    showViewAll={true}
                    viewAllLink="/all-playlists"
                  />
                ) : (
                  <div className="text-center py-4">
                    <p className="text-gray-500 text-sm">No playlists to display</p>
                  </div>
                )}
              </CardContent>
            </Card>
            
            {/* Connections */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Recent Connections</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                  <Image 
                    src="/images/albumcover1.jpg" 
                    alt="Connection" 
                    width={40} 
                    height={40} 
                    className="rounded-full"
                  />
                  <div>
                    <p className="font-medium">Lila Thompson</p>
                    <p className="text-xs text-gray-500">Discovering new beats</p>
                  </div>
                </div>
                <Separator />
                <div className="flex items-center gap-3">
                  <Image 
                    src="/images/albumcover2.jpg" 
                    alt="Connection" 
                    width={40} 
                    height={40} 
                    className="rounded-full"
                  />
                  <div>
                    <p className="font-medium">Ethan Reynolds</p>
                    <p className="text-xs text-gray-500">Jamming to favorite tunes</p>
                  </div>
                </div>
                <Separator />
                <div className="flex items-center gap-3">
                  <Image 
                    src="/images/albumcover3.jpg" 
                    alt="Connection" 
                    width={40} 
                    height={40} 
                    className="rounded-full"
                  />
                  <div>
                    <p className="font-medium">Sophie Walker</p>
                    <p className="text-xs text-gray-500">Creating a new mix</p>
                  </div>
                </div>
                <Separator />
                <Link href="/connections" className="text-sm text-blue-600 hover:underline block text-center">
                  View all connections
                </Link>
              </CardContent>
            </Card>
            
            {/* Upcoming Events */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Upcoming Events</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="bg-gray-100 rounded p-2 text-center min-w-[50px]">
                    <div className="text-xs text-gray-500">JUN</div>
                    <div className="font-bold">16</div>
                  </div>
                  <div>
                    <p className="font-medium">Music BBQ</p>
                    <p className="text-xs text-gray-500">Playlist Garden</p>
                  </div>
                </div>
                <Separator />
                <div className="flex items-center gap-3">
                  <div className="bg-gray-100 rounded p-2 text-center min-w-[50px]">
                    <div className="text-xs text-gray-500">JUL</div>
                    <div className="font-bold">24</div>
                  </div>
                  <div>
                    <p className="font-medium">Playlist Groove</p>
                    <p className="text-xs text-gray-500">Downtown Music Hall</p>
                  </div>
                </div>
                <Separator />
                <Link href="/events" className="text-sm text-blue-600 hover:underline block text-center">
                  View all events
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage