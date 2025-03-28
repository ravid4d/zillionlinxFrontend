import React, { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import Login from "./Login";
import Register from "./Register";
import ForgotPassword from "./ForgotPassword";
import AddNewBookmark from "./AddNewBookmark";
import AddNewCategory from "./AddNewCategory";
import GoogleSearchbar from "./GoogleSearchbar";
import AddNewBookmarkField from "./AddNewBookmarkField";
import Sidebar from "./Sidebar";
import Searchbar from "./Searchbar";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategoryWiseBookmarks } from "../redux/slices/bookmarkSlice";
import UpdateUserModal from "./UpdateUserModal";
import UpdateUser from "./admin/UpdateUser";

const Layout = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const [sidebar, hideSidebar] = useState(false);
  const [id, setId] = useState({ categoryId: null, subCategoryId: null });
  const { categories } = useSelector((state) => state.category);
  const { token, isLoggedIn, user } = useSelector((state) => state.auth);
  const [selectedCategory, setSelectedCategory] = useState({});
  const [selectedSubCategory, setSelectedSubCategory] = useState({});

  useEffect(() => {
    if (token && id?.categoryId) {
      dispatch(
        fetchCategoryWiseBookmarks({
          token,
          categoryId: id?.categoryId,
          subCategoryId: id?.subCategoryId
        })
      );
      setSelectedCategory(
        categories?.find((category) => category?.id === id?.categoryId)
      );
      setSelectedSubCategory(
        selectedCategory?.subcategories?.find(
          (subCategory) => subCategory?.id === id?.subCategoryId
        )
      );
    }
  }, [id?.categoryId, id?.subCategoryId, token, dispatch]);

  const [openModal, setOpenModal] = useState({
    login: false,
    register: false,
    forgot: false,
    newBookmark: false,
    newCategory: false,
    updateUser: false
  });

  const setWhichModalOpen = (modalName) => {
    setOpenModal({
      login: false,
      register: false,
      forgot: false,
      newBookmark: false,
      newCategory: false,
      updateUser: false,
      [modalName]: true
    });
  };

  const closeAllModals = () => {
    setOpenModal({
      login: false,
      register: false,
      forgot: false,
      newBookmark: false,
      newCategory: false,
      updateUser: false
    });
  };

  const getOpenModalName = () => {
    return Object.keys(openModal).find((key) => openModal[key]) || "";
  };

  const isAnyModalOpen = Object.values(openModal).some((value) => value);

  const [urlToBookmark, setUrlToBookmark] = useState("" || {});

  return (
    <div className="app-layout">
      <div
        className={`overlay z-50 hs-overlay-backdrop transition duration fixed inset-0 bg-gray-900 bg-opacity-50 dark:bg-opacity-80 dark:bg-neutral-900 ${
          isAnyModalOpen ? "visible opacity-100" : "invisible opacity-0"
        }`}
        id={getOpenModalName() ? `${getOpenModalName()}-backdrop` : ""}
      ></div>

      <div className="app-content flex flex-wrap w-full">
        {!isLoggedIn ? (
          <>
            <Login
              closeAllModals={closeAllModals}
              openModal={openModal}
              setWhichModalOpen={setWhichModalOpen}
            />
            <Register closeAllModals={closeAllModals} openModal={openModal} />
            <ForgotPassword
              closeAllModals={closeAllModals}
              openModal={openModal}
            />
          </>
        ) : (
          <>
            <AddNewBookmark
              urlToBookmark={urlToBookmark}
              closeAllModals={closeAllModals}
              openModal={openModal}
              id={id}
            />
            <AddNewCategory
              closeAllModals={closeAllModals}
              openModal={openModal}
            />
            <UpdateUserModal
              user={user}
              closeAllModals={closeAllModals}
              openModal={openModal}
            />
          </>
        )}
        <Header
          setWhichModalOpen={setWhichModalOpen}
          sidebar={sidebar}
          hideSidebar={hideSidebar}
          id={id}
          setId={setId}
        />
        <div
          className={`w-full content-area ${
            isLoggedIn ? "user-loggedin" : ""
          } ${
            (location?.pathname !== "" || location?.pathname !== "/") &&
            location?.pathname.slice(1)
          }`}
        >
          <Outlet
            context={{
              setUrlToBookmark,
              setWhichModalOpen,
              selectedSubCategory,
              selectedCategory,
              setSelectedCategory,
              setSelectedSubCategory,
              setId,
              id
            }}
          />
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default Layout;
