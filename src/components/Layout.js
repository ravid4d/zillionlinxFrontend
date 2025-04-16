import React, { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Header from "./common/Header";
import Footer from "./common/Footer";
import Login from "./modal/Login";
import Register from "./modal/Register";
import ForgotPassword from "./modal/ForgotPassword";
import AddNewBookmark from "./modal/AddNewBookmark";
// import AddNewCategory from "./modal/AddNewCategory";
import { useDispatch, useSelector } from "react-redux";
import { callTopLinks, clearInstantLink, fetchAllTopLinks, fetchCategoryWiseBookmarks } from "../redux/slices/bookmarkSlice";
import UpdateUserModal from "./modal/UpdateUserModal";
import ChangePasswordModal from "./modal/ChangePasswordModal";

const Layout = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const [sidebar, hideSidebar] = useState(false);
  const [id, setId] = useState({ categoryId: null, subCategoryId: null });
  const { categories } = useSelector((state) => state.category);
  const { token, isLoggedIn } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.user);
  const [selectedCategory, setSelectedCategory] = useState({});
  const [selectedSubCategory, setSelectedSubCategory] = useState({});
  const navigate = useNavigate();

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
    updateUser: false,
    sidebar:false,
    changePassword: false
  });

  const setWhichModalOpen = (modalName) => {
    setOpenModal({
      login: false,
      register: false,
      forgot: false,
      newBookmark: false,
      newCategory: false,
      updateUser: false,
      sidebar:false,
      changePassword: false,
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
      updateUser: false,
      sidebar:false,
      changePassword: false
    });
  };

  const getOpenModalName = () => {
    return Object.keys(openModal).find((key) => openModal[key]) || "";
  };

  const isAnyModalOpen = Object.values(openModal).some((value) => value);

  const [urlToBookmark, setUrlToBookmark] = useState("" || {});

  const redirectTo = () => {
    if (isLoggedIn && location.pathname === "/bookmarks") {
      setId({ categoryId: null, subCategoryId: null });
      dispatch(callTopLinks());
      dispatch(clearInstantLink());
      dispatch(fetchAllTopLinks(token));
    } else if (isLoggedIn && location.pathname !== "/bookmarks") {
      navigate("/bookmarks");
      dispatch(clearInstantLink());
    } else {
      if (!isLoggedIn) {
        navigate("/");
      }
    }
  };

  return (
    <div className="app-layout">
      <div
      onClick={closeAllModals}
        className={`overlay z-50 hs-overlay-backdrop transition duration fixed inset-0 bg-gray-900 bg-opacity-50 dark:bg-opacity-80 dark:bg-neutral-900 ${
          isAnyModalOpen ? "visible opacity-100" : "invisible opacity-0"
        }`}
        id={getOpenModalName() ? `${getOpenModalName()}-backdrop` : ""}
      ></div>

      <div className="app-content flex flex-wrap w-full">
        {!isLoggedIn ? (
          <>
            {openModal?.login ? (
              <Login
                closeAllModals={closeAllModals}
                openModal={openModal}
                setWhichModalOpen={setWhichModalOpen}
              />
            ) : openModal?.register ? (
              <Register
                setWhichModalOpen={setWhichModalOpen}
                closeAllModals={closeAllModals}
                openModal={openModal}
              />
            ) : openModal?.forgot ? (
              <ForgotPassword
                closeAllModals={closeAllModals}
                openModal={openModal}
              />
            ) : null}
          </>
        ) : (
          <>
            {openModal?.newBookmark ? (
              <AddNewBookmark
                urlToBookmark={urlToBookmark}
                closeAllModals={closeAllModals}
                openModal={openModal}
                id={id}
              />
            ) 
            // : openModal?.newCategory ? (
            //   <AddNewCategory
            //     closeAllModals={closeAllModals}
            //     openModal={openModal}
            //   />
            // )
             : openModal?.updateUser ? (
              <UpdateUserModal
                user={user}
                closeAllModals={closeAllModals}
                openModal={openModal}
              />
            ) : openModal?.changePassword ? (
              <ChangePasswordModal
                id={id}
                closeAllModals={closeAllModals}
                openModal={openModal}
              />
            ): null}
          </>
        )}
        <Header
          openModal={openModal}
          setWhichModalOpen={setWhichModalOpen}
          sidebar={sidebar}
          hideSidebar={hideSidebar}
          id={id}
          setUrlToBookmark={setUrlToBookmark}
          setId={setId}
          redirectTo={redirectTo}
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
              openModal,
              closeAllModals,
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
        <Footer redirectTo={redirectTo} />
      </div>
    </div>
  );
};

export default Layout;
