'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { sidebarLinks } from '../constants';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Crown, Sparkles } from 'lucide-react';

const Sidebar: React.FC = () => {
    const pathname = usePathname();
    
    return (
        <div className="bg-card border-r w-56 min-h-screen flex flex-col fixed top-0 left-0 z-40 pt-16">
            <div className="flex items-center justify-between p-6 pt-8">
                <h2 className="text-xl font-bold text-foreground">Discover</h2>
                <Badge variant="secondary" className="text-xs">
                    <Sparkles className="w-3 h-3 mr-1" />
                    New
                </Badge>
            </div>
            
            <nav className="flex flex-col px-4 flex-1">
                <div className="space-y-1">
                    {sidebarLinks.map((link, index) => {
                        const isSignOut = link.label === "Sign Out";
                        const isActive = pathname === link.route;
                        
                        return (
                            <Button
                                key={index}
                                variant={isActive ? "secondary" : "ghost"}
                                className={cn(
                                    "w-full justify-start h-11 px-3",
                                    isSignOut && "text-destructive hover:text-destructive hover:bg-destructive/10 mt-4",
                                    isActive && "bg-secondary text-secondary-foreground"
                                )}
                                asChild
                            >
                                <Link href={link.route}>
                                    <div className="w-5 h-5 relative mr-3">
                                        <Image 
                                            src={link.imgURL} 
                                            alt={link.label} 
                                            fill
                                            className="object-contain"
                                        />
                                    </div>
                                    <span className="font-medium">{link.label}</span>
                                </Link>
                            </Button>
                        );
                    })}
                </div>
            </nav>
            
            <div className="p-4 mt-auto">
                <Separator className="mb-4" />
                <Card className="bg-gradient-to-br from-brand/5 to-brand/10 border-brand/20">
                    <CardHeader className="pb-3">
                        <div className="flex items-center space-x-2">
                            <Crown className="w-4 h-4 text-brand" />
                            <CardTitle className="text-sm font-semibold">Upgrade to Premium</CardTitle>
                        </div>
                        <CardDescription className="text-xs">
                            Get advanced features and share with unlimited friends
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                        <Button 
                            className="w-full h-8 text-xs bg-brand hover:bg-brand/90" 
                            asChild
                        >
                            <Link href="/premium">
                                Upgrade Now
                            </Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default Sidebar;