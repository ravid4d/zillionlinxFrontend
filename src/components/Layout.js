import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import Login from "./Login";
import Register from "./Register";
// import Sidebar from "./Sidebar";

const Layout = () => {
    const [sidebar, hideSidebar] = useState(false);
    const [openLoginModal, setOpenLoginModal] = useState(false);
    const [openRegisterModal, setOpenRegisterModal] = useState(false);

    return (
        <div className="app-layout">
            <div className="app-content flex flex-wrap w-full">
                <Login openLoginModal={openLoginModal} setOpenLoginModal={setOpenLoginModal} />
                <Register openRegisterModal={openRegisterModal} setOpenRegisterModal={setOpenRegisterModal} />
                {/* <Sidebar sidebar={sidebar} hideSidebar={hideSidebar} /> */}
                {/* <div className={`content-area px-5 w-full ${sidebar ? 'hide' : ''}`}> */}
                <Header sidebar={sidebar} hideSidebar={hideSidebar} setOpenLoginModal={setOpenLoginModal} setOpenRegisterModal={setOpenRegisterModal} />
                <div className="w-full content-area">
                    <Outlet />
                </div>
                <Footer />
                {/* </div> */}
            </div>

        </div>
    );
};

export default Layout;
