'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { signOut } from 'next-auth/react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Crown, LogOut } from 'lucide-react';
import { navigationLinks } from '@/app/constants/navigationLinks';

const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const { data: session } = useSession();

  return (
    <div className="bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 w-72 min-h-screen flex flex-col fixed top-0 left-0 z-40 pt-20 hidden lg:flex">
      <div className="p-6">
        <div className="mb-6">
          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Navigation</p>
        </div>

        <nav className="flex flex-col space-y-1 mb-8">
          {navigationLinks.map((link) => {
            const isActive = pathname === link.route;
            const Icon = link.icon;

            return (
              <Button
                key={link.route}
                variant={isActive ? 'secondary' : 'ghost'}
                className={cn(
                  'w-full justify-between h-11 px-4 transition-all duration-200',
                  isActive && 'bg-gradient-to-r from-orange-500 to-pink-500 text-white shadow-lg hover:from-orange-600 hover:to-pink-600',
                  !isActive && 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                )}
                asChild
              >
                <Link href={link.route}>
                  <div className="flex items-center space-x-3">
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{link.label}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    {link.badge && (
                      <Badge variant="secondary" className="text-xs bg-blue-500 text-white border-0">
                        {link.badge}
                      </Badge>
                    )}
                    {link.count != null && link.count > 0 && (
                      <Badge variant="secondary" className="text-xs bg-red-500 text-white border-0">
                        {link.count}
                      </Badge>
                    )}
                  </div>
                </Link>
              </Button>
            );
          })}

          <Separator className="my-2" />

          <Button
            variant="ghost"
            className="w-full justify-start h-11 px-4 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200"
            onClick={() => signOut({ callbackUrl: '/' })}
          >
            <LogOut className="w-5 h-5 mr-3" />
            <span className="font-medium">Sign Out</span>
          </Button>
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
              Unlimited playlist sharing and advanced music matching
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <Button
              className="w-full h-9 text-xs bg-white text-purple-600 hover:bg-gray-50 font-semibold border-0 shadow-md"
              asChild
            >
              <Link href="/premium">Upgrade Now</Link>
            </Button>
          </CardContent>
        </Card>

        {/* Profile quick info */}
        {session?.user && (
          <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
            <p className="text-xs font-medium text-gray-900 dark:text-white truncate">{session.user.name}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{session.user.email}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
