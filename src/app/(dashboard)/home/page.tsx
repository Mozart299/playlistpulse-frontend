'use client';

import React from "react";
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
      <div className="bg-gradient-to-r from-orange-500 to-pink-500 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">
              {getGreeting()}, {session?.user?.name?.split(' ')[0] || 'Music Lover'}! 🎵
            </h1>
            <p className="text-white/90">
              Ready to discover new sounds and connect with fellow music enthusiasts?
            </p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow cursor-pointer p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Discover Music</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Find new songs</p>
            </div>
          </div>
        </Card>

        <Card className="border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow cursor-pointer p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-teal-500 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Find Matches</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Connect with users</p>
            </div>
          </div>
        </Card>

        <Card className="border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow cursor-pointer p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Music Events</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Discover concerts</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Real Posts Feed using HomeContent component */}
      <HomeContent />
    </div>
  );
};

export default HomePage;