'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { 
  Crown, 
  Sparkles, 
  Home, 
  Music, 
  Users, 
  MessageSquare, 
  Calendar, 
  Heart, 
  Settings,
  LogOut,
  Play,
  Star,
  TrendingUp
} from 'lucide-react';

interface SidebarLink {
  route: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  count?: number;
  special?: boolean;
}

const Sidebar: React.FC = () => {
  const pathname = usePathname();
  
  const sidebarLinks: SidebarLink[] = [
    {
      route: '/home',
      label: 'Home',
      icon: Home
    },
    {
      route: '/discover',
      label: 'Discover',
      icon: TrendingUp,
      badge: 'New'
    },
    {
      route: '/all-playlists',
      label: 'My Playlists',
      icon: Play
    },
    {
      route: '/matches',
      label: 'Music Matches',
      icon: Users
    },
    {
      route: '/events',
      label: 'Events',
      icon: Calendar
    },
    {
      route: '/messages',
      label: 'Messages',
      icon: MessageSquare,
      count: 3
    },
    {
      route: '/favorites',
      label: 'Favorites',
      icon: Heart
    },
    {
      route: '/settings',
      label: 'Settings',
      icon: Settings
    },
    {
      route: '/sign-out',
      label: 'Sign Out',
      icon: LogOut
    }
  ];
    
  return (
    <div className="bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 w-72 min-h-screen flex flex-col fixed top-0 left-0 z-40 pt-20">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Menu</h2>
          <Badge variant="secondary" className="text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 border-0">
            <Sparkles className="w-3 h-3 mr-1" />
            Pro
          </Badge>
        </div>
        
        <nav className="flex flex-col space-y-2 mb-8">
          {sidebarLinks.map((link, index) => {
            const isSignOut = link.label === "Sign Out";
            const isActive = pathname === link.route;
            const Icon = link.icon;
            
            return (
              <Button
                key={index}
                variant={isActive ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-between h-12 px-4 transition-all duration-200",
                  isSignOut && "text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 mt-4",
                  isActive && "bg-gradient-to-r from-orange-500 to-pink-500 text-white shadow-lg hover:from-orange-600 hover:to-pink-600",
                  !isActive && !isSignOut && "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                )}
                asChild
              >
                <Link href={link.route}>
                  <div className="flex items-center space-x-3">
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{link.label}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {link.badge && (
                      <Badge variant="secondary" className="text-xs bg-blue-500 text-white border-0">
                        {link.badge}
                      </Badge>
                    )}
                    {link.count && (
                      <Badge variant="secondary" className="text-xs bg-red-500 text-white border-0">
                        {link.count}
                      </Badge>
                    )}
                  </div>
                </Link>
              </Button>
            );
          })}
        </nav>
      </div>
      
      {/* Premium Upgrade Card */}
      <div className="p-6 mt-auto">
        <Separator className="mb-6" />
        <Card className="bg-gradient-to-br from-purple-500 to-pink-500 border-0 text-white">
          <CardHeader className="pb-3">
            <div className="flex items-center space-x-2">
              <Crown className="w-5 h-5" />
              <CardTitle className="text-sm font-semibold">Upgrade to Premium</CardTitle>
            </div>
            <CardDescription className="text-xs text-white/90">
              Get unlimited playlist sharing and advanced music matching features
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <Button 
              className="w-full h-9 text-xs bg-white text-purple-600 hover:bg-gray-50 font-semibold border-0 shadow-md" 
              asChild
            >
              <Link href="/premium">
                Upgrade Now
              </Link>
            </Button>
          </CardContent>
        </Card>
        
        {/* Quick Stats */}
        <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Your Stats</h3>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-600 dark:text-gray-400">Playlists</span>
              <span className="text-xs font-semibold text-gray-900 dark:text-white">24</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-600 dark:text-gray-400">Followers</span>
              <span className="text-xs font-semibold text-gray-900 dark:text-white">156</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-600 dark:text-gray-400">Following</span>
              <span className="text-xs font-semibold text-gray-900 dark:text-white">89</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;