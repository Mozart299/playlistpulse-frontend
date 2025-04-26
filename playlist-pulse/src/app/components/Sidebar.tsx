import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { sidebarLinks } from '../constants'; 

const Sidebar: React.FC = () => {
    const router = useRouter();
    
    return (
        <div className="bg-gray-50 text-gray-800 w-56 min-h-screen flex flex-col fixed top-0 left-0 z-40 pt-16 shadow-sm">
            <div className="flex p-6 pt-8">
                <span className="text-xl font-bold">Discover</span>
            </div>
            
            <nav className="flex flex-col px-4 flex-1">
                <div className="space-y-1">
                    {sidebarLinks.map((link, index) => {
                        // Check if this is the last item (Sign Out)
                        const isSignOut = link.label === "Sign Out";
                        
                        return (
                            <Link 
                                href={link.route} 
                                key={index} 
                                className={cn(
                                    "flex items-center px-3 py-3 rounded-md transition-colors hover:bg-gray-200",
                                    isSignOut ? "mt-auto text-red-600" : ""
                                )}
                            >
                                <div className="w-6 h-6 relative mr-3">
                                    <Image 
                                        src={link.imgURL} 
                                        alt={link.label} 
                                        layout="fill" 
                                        objectFit="contain"
                                    />
                                </div>
                                {link.label}
                            </Link>
                        );
                    })}
                </div>
            </nav>
            
            <div className="p-4 mt-auto">
                <div className="bg-brand/10 rounded-lg p-4">
                    <h4 className="font-medium text-sm mb-2">Upgrade to Premium</h4>
                    <p className="text-xs text-gray-600 mb-3">Get advanced features and share with unlimited friends</p>
                    <Link href="/premium" className="bg-brand text-white text-xs py-2 px-4 rounded-md inline-block hover:bg-brand/90 transition-colors">
                        Upgrade Now
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;