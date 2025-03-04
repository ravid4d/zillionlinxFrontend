import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import Login from "./Login";
import Register from "./Register";
import ForgotPassword from "./ForgotPassword";
import AddNewBookmark from "./AddNewBookmark";
import AddNewCategory from "./AddNewCategory";
import { ToastContainer } from "react-toastify";
// import { useSelector } from "react-redux";

const Layout = () => {
  // const { isLoggedIn, token, loading, error } = useSelector((state) => state.auth);
  const [sidebar, hideSidebar] = useState(false);
  
  const [openModal, setOpenModal] = useState({
    login: false,
    register: false,
    forgot: false,
    newBookmark: false,
    newCategory: false,
  });

  const setWhichModalOpen = (modalName) => {
    setOpenModal({
      login: false,
      register: false,
      forgot: false,
      newBookmark: false,
      newCategory: false,
      [modalName]: true,
    });
  };

  const closeAllModals = () => {
    setOpenModal({
      login: false,
      register: false,
      forgot: false,
      newBookmark: false,
      newCategory: false,
    });
  };

  const getOpenModalName = () => {
    return Object.keys(openModal).find((key) => openModal[key]) || "";
  };

  const isAnyModalOpen = Object.values(openModal).some(value => value);

  const [urlToBookmark, setUrlToBookmark] = useState("");

  return (
    <div className="app-layout">
      <div
        className={`overlay z-50 hs-overlay-backdrop transition duration fixed inset-0 bg-gray-900 bg-opacity-50 dark:bg-opacity-80 dark:bg-neutral-900 ${
          isAnyModalOpen ? "visible opacity-100" : "invisible opacity-0"
        }`}
        id={getOpenModalName() ? `${getOpenModalName()}-backdrop` : ""}
      ></div>

      <ToastContainer hideProgressBar={true} autoClose={2000} />
        <div className="app-content flex flex-wrap w-full">
        <Login
          closeAllModals={closeAllModals}
          openModal={openModal}
          setWhichModalOpen={setWhichModalOpen}
        />
        <Register closeAllModals={closeAllModals} openModal={openModal} />
        <ForgotPassword closeAllModals={closeAllModals} openModal={openModal} />
        <AddNewBookmark urlToBookmark={urlToBookmark} closeAllModals={closeAllModals} openModal={openModal} />
        <AddNewCategory closeAllModals={closeAllModals} openModal={openModal} />
        <Header
          setWhichModalOpen={setWhichModalOpen}
          sidebar={sidebar}
          hideSidebar={hideSidebar}
        />
        <div className="w-full content-area">
          <Outlet context={{setUrlToBookmark, setWhichModalOpen}} />
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default Layout;
