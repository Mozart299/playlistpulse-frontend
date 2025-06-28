'use client';

import React from "react";
import TopBar from "../components/TopBar";
import RightSideBar from "../components/RightSideBar";
import SessionWrapper from "../components/SessionWrapper";
import Sidebar from "@/app/components/Sidebar";

const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <SessionWrapper>
      <div className="min-h-screen bg-gray-50">
        <TopBar />
        <Sidebar />
        <div className="flex pt-16">
          {/* Main content area with proper width constraints */}
          <div className="flex-1 pl-56 pr-56">
            <main className="max-w-3xl mx-auto px-4 py-6">
              {children}
            </main>
          </div>
          
          {/* Fixed position right sidebar */}
          <div className="fixed top-16 right-0 h-screen">
            <RightSideBar />
          </div>
        </div>
      </div> 
    </SessionWrapper>
  );
};

export default DashboardLayout;