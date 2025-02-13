import React, { useRef, useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import Login from "./Login";
import Register from "./Register";
import ForgotPassword from "./ForgotPassword";
import AddNewBookmark from "./AddNewBookmark";

const Layout = () => {
    const [sidebar, hideSidebar] = useState(false);
    const [openLoginModal, setOpenLoginModal] = useState(false);
    const [openRegisterModal, setOpenRegisterModal] = useState(false);
    const [openForgotPasswordModal, setOpenForgotPasswordModal] = useState(false);
    const [openAddNewBookmarkModal, setOpenAddNewBookmarkModal] = useState(false);
    const btnRef = useRef(null);

    return (
        <div className="app-layout">
            <div className="app-content flex flex-wrap w-full">
                <Login openLoginModal={openLoginModal} setOpenLoginModal={setOpenLoginModal} setOpenRegisterModal={setOpenRegisterModal} setOpenForgotPasswordModal={setOpenForgotPasswordModal} />
                <Register openRegisterModal={openRegisterModal} setOpenRegisterModal={setOpenRegisterModal} />
                <ForgotPassword openForgotPasswordModal={openForgotPasswordModal} setOpenForgotPasswordModal={setOpenForgotPasswordModal} />
                <AddNewBookmark openAddNewBookmarkModal={openAddNewBookmarkModal} setOpenAddNewBookmarkModal={setOpenAddNewBookmarkModal} btnRef={btnRef} />
                <Header btnRef={btnRef} sidebar={sidebar} hideSidebar={hideSidebar} setOpenLoginModal={setOpenLoginModal} setOpenRegisterModal={setOpenRegisterModal} setOpenAddNewBookmarkModal={setOpenAddNewBookmarkModal} />
                <div className="w-full content-area">
                    <Outlet />
                </div>
                <Footer />
            </div>

        </div>
    );
};

export default Layout;
