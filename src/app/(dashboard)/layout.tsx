'use client';

import React from "react";
import TopBar from "../components/TopBar";
import RightSideBar from "../components/RightSideBar";
import SessionWrapper from "../components/SessionWrapper";
import Sidebar from "@/app/components/Sidebar";

const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <SessionWrapper>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <TopBar />
        <Sidebar />
        <div className="flex pt-20">
          {/* Main content area with proper spacing */}
          <div className="flex-1 ml-72 mr-80">
            <main className="max-w-4xl mx-auto px-6 py-8">
              {children}
            </main>
          </div>
          
          {/* Fixed position right sidebar */}
          <div className="fixed top-20 right-0 h-[calc(100vh-5rem)] w-80">
            <RightSideBar />
          </div>
        </div>
      </div> 
    </SessionWrapper>
  );
};

export default DashboardLayout;