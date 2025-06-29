'use client';

import React, { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Bell, MessageSquare, Search, Music, User, Settings, LogOut, ChevronDown, Menu } from 'lucide-react'
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

interface TopBarProps {
  onMobileMenuToggle?: () => void;
}

const TopBar: React.FC<TopBarProps> = ({ onMobileMenuToggle }) => {
  const { data: session } = useSession()
  const router = useRouter()
  const [showNotifications, setShowNotifications] = useState(false)
  const [searchFocused, setSearchFocused] = useState(false)
  const notificationRef = useRef<HTMLDivElement>(null)
  
  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' })
  }

  // Mock notifications data
  const notifications = [
    {
      id: 1,
      type: 'like',
      message: 'Sarah liked your playlist "Summer Vibes"',
      time: '2 minutes ago',
      read: false
    },
    {
      id: 2,
      type: 'match',
      message: 'New music match found: Alex Rivera (94% compatibility)',
      time: '1 hour ago',
      read: false
    },
    {
      id: 3,
      type: 'comment',
      message: 'Marcus commented on your post',
      time: '3 hours ago',
      read: true
    },
    {
      id: 4,
      type: 'follow',
      message: 'Emma started following you',
      time: '1 day ago',
      read: true
    }
  ]

  const unreadCount = notifications.filter(n => !n.read).length

  // Close notifications when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-sm py-3 px-4 flex items-center justify-between fixed top-0 left-0 w-full z-50 border-b border-gray-200 dark:border-gray-700">
      {/* Logo and Mobile Menu */}
      <div className="flex items-center space-x-4">
        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={onMobileMenuToggle}
        >
          <Menu className="h-6 w-6" />
        </Button>
        
        <Link href="/home" className="flex items-center space-x-2 lg:space-x-3">
          <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-r from-orange-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/30">
            <Music className="w-4 h-4 lg:w-6 lg:h-6 text-white" />
          </div>
          <span className="text-lg lg:text-xl font-bold bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent hidden sm:block">
            The Playlist
          </span>
        </Link>
      </div>
      
      {/* Search Bar */}
      <div className="flex-1 max-w-2xl mx-2 lg:mx-8 hidden md:block">
        <div className="relative">
          <Search className={`absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 transition-colors duration-200 ${
            searchFocused ? 'text-orange-500' : 'text-gray-400'
          }`} />
          <Input 
            placeholder="Search for music, playlists, or people..." 
            className={`pl-12 py-3 w-full bg-gray-100 dark:bg-gray-800 border-0 rounded-2xl transition-all duration-200 focus-visible:ring-2 focus-visible:ring-orange-500 ${
              searchFocused ? 'bg-white dark:bg-gray-700 shadow-lg' : ''
            }`}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
          />
        </div>
      </div>
      
      {/* Right Actions */}
      <div className="flex items-center space-x-2 lg:space-x-4">
        {/* Mobile Search Button */}
        <Button 
          variant="ghost" 
          size="icon" 
          className="md:hidden hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all duration-200"
        >
          <Search className="h-5 w-5 text-gray-600 dark:text-gray-300" />
        </Button>
        
        {/* Messages */}
        <Button 
          variant="ghost" 
          size="icon" 
          className="relative hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all duration-200 hidden sm:flex" 
          asChild
        >
          <Link href="/messages">
            <MessageSquare className="h-5 w-5 lg:h-6 lg:w-6 text-gray-600 dark:text-gray-300" />
            <span className="absolute -top-1 -right-1 w-4 h-4 lg:w-5 lg:h-5 bg-orange-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
              3
            </span>
          </Link>
        </Button>
        
        {/* Notifications */}
        <div className="relative" ref={notificationRef}>
          <Button
            variant="ghost"
            size="icon"
            className="relative hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all duration-200"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <Bell className="h-5 w-5 lg:h-6 lg:w-6 text-gray-600 dark:text-gray-300" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
            )}
          </Button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 top-12 w-80 sm:w-96 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 py-4 z-50">
              <div className="px-6 pb-3 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900 dark:text-white">Notifications</h3>
                  {unreadCount > 0 && (
                    <span className="text-xs bg-orange-500 text-white px-2 py-1 rounded-full">
                      {unreadCount} new
                    </span>
                  )}
                </div>
              </div>
              <div className="max-h-96 overflow-y-auto">
                {notifications.map((notification) => (
                  <div 
                    key={notification.id}
                    className={`px-6 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors ${
                      !notification.read ? 'bg-orange-50 dark:bg-orange-900/20' : ''
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`w-2 h-2 rounded-full mt-2 ${
                        !notification.read ? 'bg-orange-500' : 'bg-gray-300 dark:bg-gray-600'
                      }`}></div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-900 dark:text-white">{notification.message}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{notification.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="px-6 pt-3 border-t border-gray-200 dark:border-gray-700">
                <Button 
                  variant="ghost" 
                  className="w-full text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-900/20"
                  onClick={() => setShowNotifications(false)}
                >
                  View All Notifications
                </Button>
              </div>
            </div>
          )}
        </div>
        
        {/* Profile Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 lg:h-10 lg:w-10 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200">
              <Avatar className="h-7 w-7 lg:h-9 lg:w-9 border-2 border-orange-500/20">
                <AvatarImage src={session?.user?.image || ''} alt="Profile" />
                <AvatarFallback className="bg-gradient-to-r from-orange-500 to-pink-500 text-white font-semibold text-sm">
                  {getInitials(session?.user?.name)}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-64 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-xl" align="end" forceMount>
            <DropdownMenuLabel className="font-normal px-4 py-3">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none text-gray-900 dark:text-white">
                  {session?.user?.name}
                </p>
                <p className="text-xs leading-none text-gray-500 dark:text-gray-400">
                  {session?.user?.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-gray-200 dark:bg-gray-700" />
            <DropdownMenuItem 
              className="px-4 py-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 focus:bg-gray-50 dark:focus:bg-gray-700"
              onSelect={() => router.push('/my-profile')}
            >
              <User className="mr-3 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem 
              className="px-4 py-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 focus:bg-gray-50 dark:focus:bg-gray-700"
              onSelect={() => router.push('/all-playlists')}
            >
              <Music className="mr-3 h-4 w-4" />
              <span>My Playlists</span>
            </DropdownMenuItem>
            <DropdownMenuItem 
              className="px-4 py-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 focus:bg-gray-50 dark:focus:bg-gray-700"
              onSelect={() => router.push('/settings')}
            >
              <Settings className="mr-3 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-gray-200 dark:bg-gray-700" />
            <DropdownMenuItem 
              className="px-4 py-3 cursor-pointer hover:bg-red-50 dark:hover:bg-red-900/20 focus:bg-red-50 dark:focus:bg-red-900/20 text-red-600 dark:text-red-400"
              onSelect={handleSignOut}
            >
              <LogOut className="mr-3 h-4 w-4" />
              <span>Sign out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}

export default TopBar