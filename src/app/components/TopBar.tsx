'use client';

import React, { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Bell, MessageSquare, Search, Music, User, Settings, LogOut, Menu, ArrowLeft, X } from 'lucide-react'
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
  isMobileMenuOpen?: boolean;
}

const TopBar: React.FC<TopBarProps> = ({ onMobileMenuToggle, isMobileMenuOpen = false }) => {
  const { data: session } = useSession()
  const router = useRouter()
  const [showNotifications, setShowNotifications] = useState(false)
  const [searchFocused, setSearchFocused] = useState(false)
  const [showMobileSearch, setShowMobileSearch] = useState(false)
  const notificationRef = useRef<HTMLDivElement>(null)
  const mobileSearchRef = useRef<HTMLInputElement>(null)
  
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
    <div className="fixed top-0 left-0 w-full z-50">
      {/* Main bar */}
      <div className="bg-card/90 backdrop-blur-md py-3 px-4 flex items-center justify-between border-b border-border">
        {/* Logo and Mobile Menu */}
        <div className="flex items-center space-x-2 sm:space-x-4">
          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={onMobileMenuToggle}
            aria-label={isMobileMenuOpen ? "Close mobile menu" : "Open mobile menu"}
            aria-expanded={isMobileMenuOpen}
          >
            <Menu className="h-6 w-6" />
          </Button>

          <Link href="/home" className="flex items-center space-x-2 lg:space-x-3">
            <div className="w-8 h-8 lg:w-10 lg:h-10 bg-primary rounded-md flex items-center justify-center shadow-sm">
              <Music className="w-4 h-4 lg:w-6 lg:h-6 text-primary-foreground" />
            </div>
            <span className="text-lg lg:text-xl font-bold text-foreground hidden sm:block">
              The Playlist
            </span>
          </Link>
        </div>

        {/* Desktop Search Bar */}
        <div className="flex-1 max-w-2xl mx-2 lg:mx-8 hidden md:block">
          <div className="relative">
            <Search className={`absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 transition-colors duration-200 ${
              searchFocused ? 'text-primary' : 'text-muted-foreground'
            }`} />
            <Input
              placeholder="Search for music, playlists, or people..."
              className={`pl-12 py-3 w-full bg-muted/60 border-border rounded-md transition-colors placeholder:text-muted-foreground ${
                searchFocused ? 'bg-background shadow-sm' : ''
              }`}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
            />
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center space-x-1 sm:space-x-2 lg:space-x-4">
          {/* Mobile Search Toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            aria-label="Open search"
            onClick={() => {
              setShowMobileSearch(true)
              setTimeout(() => mobileSearchRef.current?.focus(), 50)
            }}
          >
              <Search className="h-5 w-5" />
          </Button>

          {/* Messages */}
          <Button
            variant="ghost"
            size="icon"
            className="relative hidden sm:flex"
            asChild
          >
            <Link href="/messages">
              <MessageSquare className="h-5 w-5 lg:h-6 lg:w-6" />
              <span className="absolute -top-1 -right-1 w-4 h-4 lg:w-5 lg:h-5 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center font-medium">
                3
              </span>
            </Link>
          </Button>

          {/* Notifications */}
          <div className="relative" ref={notificationRef}>
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              onClick={() => setShowNotifications(!showNotifications)}
              aria-label={`Notifications ${unreadCount > 0 ? `(${unreadCount} unread)` : ''}`}
              aria-expanded={showNotifications}
            >
              <Bell className="h-5 w-5 lg:h-6 lg:w-6" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full" />
              )}
            </Button>

            {/* Notifications Dropdown — capped to viewport width on mobile */}
            {showNotifications && (
              <div className="absolute right-0 top-12 w-80 max-w-[calc(100vw-1rem)] bg-popover text-popover-foreground rounded-lg shadow-lg border border-border py-4 z-50">
                <div className="px-4 sm:px-6 pb-3 border-b border-border">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-foreground">Notifications</h3>
                    {unreadCount > 0 && (
                      <span className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded-md">
                        {unreadCount} new
                      </span>
                    )}
                  </div>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`px-4 sm:px-6 py-3 hover:bg-accent cursor-pointer transition-colors ${
                        !notification.read ? 'bg-accent/60' : ''
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                          !notification.read ? 'bg-primary' : 'bg-muted-foreground/30'
                        }`} />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-foreground">{notification.message}</p>
                          <p className="text-xs text-muted-foreground mt-1">{notification.time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="px-4 sm:px-6 pt-3 border-t border-border">
                  <Button
                    variant="ghost"
                    className="w-full"
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
              <Button variant="ghost" className="relative h-8 w-8 lg:h-10 lg:w-10">
                <Avatar className="h-7 w-7 lg:h-9 lg:w-9 border border-border">
                  <AvatarImage src={session?.user?.image || ''} alt="Profile" />
                  <AvatarFallback className="bg-primary text-primary-foreground font-semibold text-sm">
                    {getInitials(session?.user?.name)}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-64" align="end" forceMount>
              <DropdownMenuLabel className="font-normal px-4 py-3">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none text-foreground">
                    {session?.user?.name}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground truncate">
                    {session?.user?.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="px-4 py-3 cursor-pointer"
                onSelect={() => router.push('/my-profile')}
              >
                <User className="mr-3 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="px-4 py-3 cursor-pointer"
                onSelect={() => router.push('/all-playlists')}
              >
                <Music className="mr-3 h-4 w-4" />
                <span>My Playlists</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="px-4 py-3 cursor-pointer"
                onSelect={() => router.push('/settings')}
              >
                <Settings className="mr-3 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="px-4 py-3 cursor-pointer text-destructive focus:text-destructive"
                onSelect={handleSignOut}
              >
                <LogOut className="mr-3 h-4 w-4" />
                <span>Sign out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Mobile Search Bar — slides in below the top bar */}
      {showMobileSearch && (
        <div className="md:hidden bg-card border-b border-border px-3 py-2 flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="flex-shrink-0"
            onClick={() => setShowMobileSearch(false)}
            aria-label="Close search"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              ref={mobileSearchRef}
              placeholder="Search music, playlists, people..."
              className="pl-9 bg-muted/60 border-border"
            />
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="flex-shrink-0"
            onClick={() => setShowMobileSearch(false)}
            aria-label="Cancel search"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  )
}

export default TopBar
