"use client"

import React from "react";
import TopBar from "../../components/TopBar";
import SideBar from "../../components/SideBar";
import RightSideBar from "../../components/RightSideBar";
import SessionWrapper from "../../components/SessionWrapper";
import HomeContent from "../../components/HomeContent";
import { useSession } from "next-auth/react";

const Home: React.FC = () => {

  return (
    <div className="flex min-h-screen">
      <TopBar />
      <SideBar />
      <div className="flex overflow-hidden pt-20 pl-56">
        <HomeContent />
        <RightSideBar />
      </div>
    </div>
  );
};

export default Home;