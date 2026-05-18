'use client';

import React from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Card } from "@/components/ui/card";
import {
  TrendingUp,
  Users,
  Calendar
} from 'lucide-react';
import HomeContent from "@/app/components/HomeContent";

const HomePage: React.FC = () => {
  const { data: session } = useSession();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-orange-500 to-pink-500 rounded-2xl p-4 sm:p-6 text-white">
        <h1 className="text-xl sm:text-2xl font-bold mb-1 sm:mb-2 leading-tight">
          {getGreeting()}, {session?.user?.name?.split(' ')[0] || 'Music Lover'}! 🎵
        </h1>
        <p className="text-white/90 text-sm sm:text-base">
          Ready to discover new sounds and connect with fellow music enthusiasts?
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-3 gap-3 sm:gap-4">
        <Link href="/discover" className="block">
          <Card className="border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow cursor-pointer p-3 sm:p-4">
            <div className="flex flex-col sm:flex-row items-center sm:space-x-3 gap-1 sm:gap-0 text-center sm:text-left">
              <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">Discover</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 hidden sm:block">Browse playlists</p>
              </div>
            </div>
          </Card>
        </Link>

        <Link href="/matches" className="block">
          <Card className="border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow cursor-pointer p-3 sm:p-4">
            <div className="flex flex-col sm:flex-row items-center sm:space-x-3 gap-1 sm:gap-0 text-center sm:text-left">
              <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-r from-green-500 to-teal-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <Users className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">Matches</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 hidden sm:block">Find music twins</p>
              </div>
            </div>
          </Card>
        </Link>

        <Link href="/events" className="block">
          <Card className="border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow cursor-pointer p-3 sm:p-4">
            <div className="flex flex-col sm:flex-row items-center sm:space-x-3 gap-1 sm:gap-0 text-center sm:text-left">
              <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">Events</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 hidden sm:block">Music events</p>
              </div>
            </div>
          </Card>
        </Link>
      </div>

      {/* Real Posts Feed using HomeContent component */}
      <HomeContent />
    </div>
  );
};

export default HomePage;