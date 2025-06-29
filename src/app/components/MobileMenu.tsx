'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Home, 
  Music, 
  Users, 
  MessageSquare, 
  Calendar, 
  Heart, 
  Settings,
  LogOut,
  Play,
  TrendingUp,
  X
} from 'lucide-react';

interface SidebarLink {
  route: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  count?: number;
}

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose }) => {
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50" onClick={onClose}></div>
      
      {/* Menu Panel */}
      <div className="fixed top-0 left-0 h-full w-80 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 shadow-xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 pt-20 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Menu</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        {/* Navigation Links */}
        <div className="flex-1 overflow-y-auto p-6">
          <nav className="flex flex-col space-y-2">
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
                  onClick={onClose}
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
        
        {/* Footer Stats */}
        <div className="p-6 border-t border-gray-200 dark:border-gray-700">
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
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
    </div>
  );
};

export default MobileMenu;