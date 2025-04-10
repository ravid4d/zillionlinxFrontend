import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { handleLogout } from "../redux/slices/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { callTopLinks, fetchAllTopLinks } from "../redux/slices/bookmarkSlice";
import { clearInstantLink } from "../redux/slices/bookmarkSlice";
import { clearUser } from "../redux/slices/userSlice";
import Swal from "sweetalert2";
import axios from "axios";

const Header = ({ setWhichModalOpen, id, setId, openModal }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { isLoggedIn, userRole, token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.user);
  const [toggleSettingsDropdown, setToggleSettingsDropdown] = useState(false);
  const menuRef = useRef(null);

  const handleUserLogout = async () => {
    try {
      await dispatch(handleLogout())
        .unwrap()
        .then(async (res) => {
          await dispatch(clearUser());
          navigate("/", {
            state: {
              loginMessage:
                res?.message || "You have been logged out successfully!",
            },
          });
        });
    } catch (error) {
      toast.error("Logout failed! Please try again.");
    }
  };
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

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setToggleSettingsDropdown(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuRef]);

  const deleteAccount = async () => {
    Swal.fire({
      title: "Are you sure?",
      text: "Your account and all associated data will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.post(
            `${process.env.REACT_APP_API_URL}/api/delete-user`,
            {},
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          Swal.fire(
            "Deleted!",
            "Your account has been deleted.",
            "success"
          ).then(async () => {
            await dispatch(handleLogout());
            navigate("/good-bye");
          });
        } catch (error) {
          console.error("Delete failed:", error);
          Swal.fire(
            "Error",
            "Something went wrong while deleting your account.",
            "error"
          );
        }
      }
    });
  };

  return (
    <header className="flex flex-wrap flex-col xl:flex-row  md:justify-start md:flex-nowrap z-[38] w-full">
      <nav className="relative max-w-screen-2xl w-full mx-auto flex items-center justify-between gap-3 px-4 sm:px-6 xl:px-2">
        <div className="flex justify-between items-end gap-x-1">
          <div
            onClick={redirectTo}
            className="flex flex-wrap items-center font-semibold text-xl text-black focus:outline-none focus:opacity-80 max-w-72 h-14 xl:h-16 cursor-pointer"
            aria-label="Brand"
          >
            <img
              src="/logo.svg"
              alt=""
              className="max-w-full max-h-full block"
            />
          </div>
        </div>

        <div
          id="hs-header-base"
          className="transition-all duration-300 basis-full grow block"
        >
          <div className="">
            <div className="py-2 md:py-0 flex flex-row items-center gap-0.5 md:gap-1">
              <div className="ms-auto flex flex-wrap items-center gap-x-1.5">
                <button
                  type="button"
                  className={`${
                    location?.pathname === "/bookmarks" ? "flex" : "hidden"
                  } relative text-sm font-semibold border border-transparent text-gray-800 hover:bg-gray-100 focus:bg-gray-100 size-4 sm:size-9 xl:hidden justify-center items-center rounded-lg focus:outline-none disabled:opacity-50 disabled:pointer-events-none !z-[10]`}
                  onClick={() => setWhichModalOpen("sidebar")}
                >
                  <span className="sr-only">Toggle Navigation</span>
                  <svg
                    className="size-4 sm:size-6 shrink-0"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#2131E5"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect width="18" height="18" x="3" y="3" rx="2" />
                    <path d="M15 3v18" />
                    <path d="m8 9 3 3-3 3" />
                  </svg>
                </button>

                {isLoggedIn && userRole === "user" ? (
                  <>
                    <div
                      className={`${
                        toggleSettingsDropdown ? "open" : ""
                      } relative `}
                      ref={menuRef}
                    >
                      <button
                        type="button"
                        className="flex flex-wrap w-full items-center group"
                        id="hs-dropdown-with-icons"
                        aria-haspopup="menu"
                        aria-expanded={
                          toggleSettingsDropdown ? "true" : "false"
                        }
                        aria-label="Dropdown"
                        onClick={() =>
                          setToggleSettingsDropdown(!toggleSettingsDropdown)
                        }
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={2}
                          stroke="currentColor"
                          className="size-4 sm:size-6 text-dark-blue group-hover:text-navy"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 0 1 1.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.559.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.894.149c-.424.07-.764.383-.929.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 0 1-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.398.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 0 1-.12-1.45l.527-.737c.25-.35.272-.806.108-1.204-.165-.397-.506-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.108-1.204l-.526-.738a1.125 1.125 0 0 1 .12-1.45l.773-.773a1.125 1.125 0 0 1 1.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894Z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                          />
                        </svg>
                      </button>
                      <div
                        className={`${
                          toggleSettingsDropdown ? "opacity-100" : "hidden"
                        } absolute transition-[opacity,margin] duration opacity-0 min-w-60 bg-white shadow-md rounded-lg block mt-4 divide-y divide-gray-200 left-[-112px] sm:left-[-108px] w-60 before:content-[''] before:absolute before:-top-4 before:left-1/2 before:-translate-x-1/2 before:border-8 before:border-transparent before:border-b-white`}
                      >
                        <div className="p-1 space-y-0.5">
                          <button
                            className="w-full flex items-center gap-x-3.5 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:hover:text-neutral-300 dark:focus:bg-neutral-700"
                            type="button"
                            onClick={() => {
                              setWhichModalOpen("updateUser");
                            }}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={1.5}
                              stroke="currentColor"
                              className="size-6"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                              />
                            </svg>
                            Update User Info
                          </button>
                          {!user?.google_id && (
                            <button
                              className="w-full flex items-center gap-x-3.5 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:hover:text-neutral-300 dark:focus:bg-neutral-700"
                              type="button"
                              onClick={() => {
                                setWhichModalOpen("changePassword");
                              }}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className="size-6"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
                                />
                              </svg>
                              Change Password
                            </button>
                          )}
                          <button
                            className="w-full flex items-center gap-x-3.5 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:hover:text-neutral-300 dark:focus:bg-neutral-700"
                            type="button"
                            onClick={deleteAccount}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={1.5}
                              stroke="currentColor"
                              className="size-6"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M6 18.75A2.25 2.25 0 0 0 8.25 21h7.5A2.25 2.25 0 0 0 18 18.75V7.5M4.5 7.5h15M10.5 11.25v6M13.5 11.25v6M9.75 4.5h4.5a.75.75 0 0 1 .75.75V6H9V5.25a.75.75 0 0 1 .75-.75Z"
                              />
                            </svg>
                            Delete Account
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="mx-1 sm:mx-4">
                      <div className="w-px h-4 bg-mid-blue"></div>
                    </div>
                  </>
                ) : null}
                {isLoggedIn ? (
                  <>
                    <button
                      className="btn dark-btn !hidden 2xl:!inline-flex"
                      onClick={handleUserLogout}
                    >
                      Logout
                    </button>
                    <svg
                      onClick={handleUserLogout}
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                      className="size-4 sm:size-6 shrink-0 stroke-dark-blue group-hover:fill-navy block 2xl:hidden"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15"
                      />
                    </svg>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="c
                      urrentColor"
                      className="size-4 sm:size-6 shrink-0 stroke-dark-blue group-hover:fill-navy block 2xl:hidden"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
                      />
                    </svg>
                    <button
                      className="btn dark-btn !hidden 2xl:!inline-flex"
                      onClick={redirectTo}
                      // to="/bookmarks"
                    >
                      Home
                    </button>
                    {userRole === "admin" ? (
                      <Link className="btn dark-btn" to="/admin">
                        Dashboard
                      </Link>
                    ) : null}
                  </>
                ) : (
                  <>
                    <button
                      className="btn light-btn"
                      onClick={() => setWhichModalOpen("login")}
                    >
                      Log in
                    </button>
                    <button
                      className="btn light-btn"
                      onClick={() => navigate("/about")}
                    >
                      About
                    </button>
                    <button
                      className="btn dark-btn"
                      onClick={() => setWhichModalOpen("register")}
                    >
                      Sign up
                    </button>
                  </>
                )}
              </div>

              <div className="flex justify-end items-center gap-x-2 ms-2">
                {isLoggedIn && userRole === "user" ? (
                  <nav className="justify-end ml-3 hidden xl:flex flex-wrap">
                    <button
                      onClick={redirectTo}
                      className="px-4 xl:px-6 py-4 xl:py-5 text-tabs text-base xl:text-lg bg-navy tracking-wide rounded-tl-[20px] inline-flex items-center hover:text-blue-600 focus:outline-none focus:text-blue-600 disabled:opacity-50 disabled:pointer-events-none hs-tab-active:font-semibold hs-tab-active:border-blue-600 hs-tab-active:text-blue-600"
                    >
                      My Bookmarks
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setWhichModalOpen("newBookmark");
                      }}
                      className="px-4 xl:px-6 py-4 xl:py-5 text-tabs text-base xl:text-lg bg-navy tracking-wide inline-flex items-center hover:text-blue-600 focus:outline-none focus:text-blue-600 disabled:opacity-50 disabled:pointer-events-none hs-tab-active:font-semibold hs-tab-active:border-blue-600 hs-tab-active:text-blue-600"
                    >
                      Add New Bookmark
                    </button>
                    <Link
                      to="/import"
                      className="px-4 xl:px-6 py-4 xl:py-5 text-tabs text-base xl:text-lg bg-navy tracking-wide rounded-tr-[20px] inline-flex items-center hover:text-blue-600 focus:outline-none focus:text-blue-600 disabled:opacity-50 disabled:pointer-events-none hs-tab-active:font-semibold hs-tab-active:border-blue-600 hs-tab-active:text-blue-600"
                    >
                      Import Bookmarks
                    </Link>
                  </nav>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </nav>
      {isLoggedIn && userRole === "user" ? (
        <div className="px-4 sm:px-6 xl:px-2 xl:hidden">
          <nav className="pt-4 bg-navy sm:bg-transparent rounded-tl-[20px] rounded-tr-[20px] flex flex-wrap sm:justify-end xl:hidden">
            <Link
              to="/bookmarks"
              className="px-4 xl:px-6 py-2 sm:py-4 xl:py-5 text-tabs text-base xl:text-lg bg-navy tracking-wide rounded-tl-[20px] inline-flex items-center hover:text-blue-600 focus:outline-none focus:text-blue-600 disabled:opacity-50 disabled:pointer-events-none hs-tab-active:font-semibold hs-tab-active:border-blue-600 hs-tab-active:text-blue-600"
            >
              My Bookmarks
            </Link>
            {/* btnRef.current.click(); */}
            <button
              type="button"
              onClick={() => {
                setWhichModalOpen("newBookmark");
              }}
              className="px-4 xl:px-6 py-2 sm:py-4 xl:py-5 text-tabs text-base xl:text-lg bg-navy tracking-wide inline-flex items-center hover:text-blue-600 focus:outline-none focus:text-blue-600 disabled:opacity-50 disabled:pointer-events-none hs-tab-active:font-semibold hs-tab-active:border-blue-600 hs-tab-active:text-blue-600"
            >
              Add New Bookmark
            </button>
            <Link
              to="/import"
              className="px-4 xl:px-6 py-2 sm:py-4 xl:py-5 text-tabs text-base xl:text-lg bg-navy tracking-wide rounded-tr-[20px] inline-flex items-center hover:text-blue-600 focus:outline-none focus:text-blue-600 disabled:opacity-50 disabled:pointer-events-none hs-tab-active:font-semibold hs-tab-active:border-blue-600 hs-tab-active:text-blue-600"
            >
              Import Bookmarks
            </Link>
          </nav>
        </div>
      ) : null}
    </header>
  );
};

export default Header;
