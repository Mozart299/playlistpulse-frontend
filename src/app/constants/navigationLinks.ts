import { Home, Play, TrendingUp, Users, Calendar, MessageSquare, Heart, Settings, User } from 'lucide-react';
import type { ComponentType } from 'react';

export interface NavLink {
  route: string;
  label: string;
  icon: ComponentType<{ className?: string }>;
  badge?: string;
  count?: number;
}

export const navigationLinks: NavLink[] = [
  { route: '/home',         label: 'Home',          icon: Home },
  { route: '/my-profile',   label: 'My Profile',    icon: User },
  { route: '/all-playlists',label: 'My Playlists',  icon: Play },
  { route: '/discover',     label: 'Discover',      icon: TrendingUp, badge: 'New' },
  { route: '/matches',      label: 'Music Matches', icon: Users },
  { route: '/events',       label: 'Events',        icon: Calendar },
  { route: '/messages',     label: 'Messages',      icon: MessageSquare, count: 3 },
  { route: '/favorites',    label: 'Favorites',     icon: Heart },
  { route: '/settings',     label: 'Settings',      icon: Settings },
];
