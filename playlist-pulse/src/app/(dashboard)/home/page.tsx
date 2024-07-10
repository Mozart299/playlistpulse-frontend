"use client"

import React from "react";
import TopBar from "../../components/TopBar";
import RightSideBar from "../../components/RightSideBar";
import SessionWrapper from "../../components/SessionWrapper";
import HomeContent from "../../components/HomeContent";
import Sidebar from "@/app/components/Sidebar";

const Home: React.FC = () => {

  return (
    <SessionWrapper>
      <div className="flex min-h-screen">
        <TopBar />
        <Sidebar />
        <div className="flex overflow-hidden pt-20 pl-56">
          <HomeContent />
          <RightSideBar />
        </div>
      </div> 
    </SessionWrapper>
  );
};

export default Home;