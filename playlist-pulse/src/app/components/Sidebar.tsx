import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { sidebarLinks } from '../constants'; 

const Sidebar: React.FC = () => {
    return (
        <div className="bg-customgray text-black w-56 min-h-screen flex flex-col fixed top-0 left-0 z-40">
            <div className="flex p-6">
                <span className="text-2xl font-bold">Discover</span>
            </div>
            <nav className="flex flex-col p-4">
                {sidebarLinks.map((link, index) => (
                    <Link href={link.route} key={index} className="flex items-center px-4 mt-10 hover:bg-brand rounded-md">
                        <Image src={link.imgURL} alt={link.label} width={20} height={20} className="mr-3" />
                        {link.label}
                    </Link>
                ))}
            </nav>
        </div>
    );
};

export default Sidebar;
