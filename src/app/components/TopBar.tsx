'use client';

import React from 'react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Bell, MessageSquare, Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { signOut } from 'next-auth/react'
import { getInitials } from '@/lib/utils'

const TopBar: React.FC = () => {
  const { data: session } = useSession()
  const router = useRouter()
  
  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' })
  }

  return (
    <div className="bg-brand shadow-md py-3 px-4 flex items-center justify-between fixed top-0 left-0 w-full z-50">
      <div className="flex items-center">
        <Link href="/home" className="text-2xl font-bold text-white">
          The Playlist
        </Link>
      </div>
      
      <div className="flex-1 max-w-2xl mx-auto relative">
        <div className="relative flex items-center">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
          <Input 
            placeholder="Search for music, playlists, or people..." 
            className="pl-10 py-2 w-full bg-white border-0 focus-visible:ring-2"
          />
        </div>
      </div>
      
      <div className="flex items-center space-x-1 md:space-x-4">
        <Button variant="ghost" size="icon" className="text-white" asChild>
          <Link href="/messages">
            <MessageSquare className="h-5 w-5" />
          </Link>
        </Button>
        
        <Button variant="ghost" size="icon" className="text-white" asChild>
          <Link href="/notifications">
            <Bell className="h-5 w-5" />
          </Link>
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-9 w-9 border border-white/30">
                <AvatarImage src={session?.user?.image || ''} alt="Profile" />
                <AvatarFallback>{getInitials(session?.user?.name)}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{session?.user?.name}</p>
                <p className="text-xs leading-none text-muted-foreground">
                  {session?.user?.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={() => router.push('/my-profile')}>
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => router.push('/all-playlists')}>
              My Playlists
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => router.push('/settings')}>
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={handleSignOut}>
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}

export default TopBar