import React from "react";
import TopBar from "./components/TopBar";
import RightSideBar from "./components/RightSideBar";
import SideBar from "./components/Sidebar";

const Home: React.FC = () => {
    return (
        <div className="">
            <TopBar />
            <SideBar />
            <RightSideBar />
        </div>
    );
};

export default Home;
