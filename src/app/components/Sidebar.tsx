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
    <div className="bg-card border-r border-border w-72 min-h-screen flex flex-col fixed top-0 left-0 z-40 pt-20 hidden lg:flex">
      <div className="p-6">
        <div className="mb-6">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Navigation</p>
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
                  isActive && 'bg-primary text-primary-foreground shadow-sm hover:bg-primary/90',
                  !isActive && 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
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
                      <Badge variant="secondary" className="text-xs">
                        {link.badge}
                      </Badge>
                    )}
                    {link.count != null && link.count > 0 && (
                      <Badge variant="outline" className="text-xs border-primary/25 text-primary">
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
            className="w-full justify-start h-11 px-4 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
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
        <Card className="border-primary/20 bg-primary/10 text-foreground shadow-none">
          <CardHeader className="pb-3">
            <div className="flex items-center space-x-2">
              <Crown className="w-5 h-5" />
              <CardTitle className="text-sm font-semibold">Upgrade to Premium</CardTitle>
            </div>
            <CardDescription className="text-xs">
              Unlimited playlist sharing and advanced music matching
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <Button
              className="w-full h-9 text-xs font-semibold"
              asChild
            >
              <Link href="/premium">Upgrade Now</Link>
            </Button>
          </CardContent>
        </Card>

        {/* Profile quick info */}
        {session?.user && (
          <div className="mt-4 rounded-lg border border-border bg-muted/40 p-3">
            <p className="text-xs font-medium text-foreground truncate">{session.user.name}</p>
            <p className="text-xs text-muted-foreground truncate">{session.user.email}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
