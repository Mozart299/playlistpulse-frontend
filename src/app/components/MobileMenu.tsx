'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { LogOut, X } from 'lucide-react';
import { navigationLinks } from '@/app/constants/navigationLinks';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose }) => {
  const pathname = usePathname();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />

      {/* Menu Panel */}
      <div className="fixed top-0 left-0 h-full w-80 bg-card border-r border-border shadow-xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 pt-20 border-b border-border">
          <h2 className="text-lg font-bold text-foreground">Menu</h2>
          <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 overflow-y-auto p-4">
          <nav className="flex flex-col space-y-1">
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
                  onClick={onClose}
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
              onClick={() => { onClose(); signOut({ callbackUrl: '/' }); }}
            >
              <LogOut className="w-5 h-5 mr-3" />
              <span className="font-medium">Sign Out</span>
            </Button>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;
