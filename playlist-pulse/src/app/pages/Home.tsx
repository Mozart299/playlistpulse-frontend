import React from "react";
import TopBar from "../components/TopBar";
import Sidebar from "../components/Sidebar";
import RightSideBar from "../components/RightSideBar";

const Home: React.FC = () => {
    return (
        <div className="">
            <TopBar/>
            <Sidebar/>
            <RightSideBar/>
        </div>
    );
};

export default Home