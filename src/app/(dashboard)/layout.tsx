'use client';

import React, { useState } from "react";
import TopBar from "../components/TopBar";
import RightSideBar from "../components/RightSideBar";
import SessionWrapper from "../components/SessionWrapper";
import Sidebar from "@/app/components/Sidebar";
import MobileMenu from "../components/MobileMenu";

const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <SessionWrapper>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <TopBar onMobileMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)} />
        <Sidebar />
        
        {/* Mobile Menu */}
        <MobileMenu 
          isOpen={isMobileMenuOpen} 
          onClose={() => setIsMobileMenuOpen(false)} 
        />
        
        <div className="flex pt-20">
          {/* Main content area with responsive spacing */}
          <div className="flex-1 lg:ml-72 xl:mr-80 px-4 lg:px-0">
            <main className="max-w-4xl mx-auto px-2 sm:px-6 py-4 sm:py-8">
              {children}
            </main>
          </div>
          
          {/* Fixed position right sidebar - hidden on smaller screens */}
          <div className="hidden xl:block fixed top-20 right-0 h-[calc(100vh-5rem)] w-80">
            <RightSideBar />
          </div>
        </div>
      </div> 
    </SessionWrapper>
  );
};

export default DashboardLayout;