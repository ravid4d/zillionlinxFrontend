import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { logout } from "../redux/slices/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { callTopLinks, fetchAllTopLinks } from "../redux/slices/bookmarkSlice";

const Header = ({ setWhichModalOpen, id, setId,  openModal }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { isLoggedIn, userRole, token } = useSelector((state) => state.auth);

  const handleLogout = async () => {
    try {
      await dispatch(logout());
      navigate("/", {
        state: { loginMessage: "You have been logged out successfully!" }
      });
    } catch (error) {
      toast.error("Logout failed! Please try again.");
    }
  };
  const redirectTo = () => {
    if (isLoggedIn && location.pathname === "/bookmarks") {
      setId({ categoryId: null, subCategoryId: null });
      dispatch(callTopLinks());
      dispatch(fetchAllTopLinks(token));
    } else if (isLoggedIn && location.pathname !== "/bookmarks") {
      navigate("/bookmarks");
    } else {
      if (!isLoggedIn) {
        navigate("/");
      }
    }
  };
  return (
    <header className="flex flex-wrap flex-col xl:flex-row  md:justify-start md:flex-nowrap z-[38] w-full">
      <nav className="relative max-w-screen-3xl w-full mx-auto flex items-center justify-between gap-3 px-4 sm:px-6 xl:px-2">
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
          className="overflow-hidden transition-all duration-300 basis-full grow block "
          aria-labelledby="hs-header-base-collapse"
        >
          <div className="overflow-hidden overflow-y-auto max-h-[75vh] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300">
            <div className="py-2 md:py-0 flex flex-row items-center gap-0.5 md:gap-1">
              <div className="ms-auto flex flex-wrap items-center gap-x-1.5">
                
              <button
                  type="button" 
                  className={`${location?.pathname === "/" ? 'hidden':'flex'} relative text-sm font-semibold border border-transparent text-gray-800 hover:bg-gray-100 focus:bg-gray-100 size-4 sm:size-9 xl:hidden justify-center items-center rounded-lg focus:outline-none disabled:opacity-50 disabled:pointer-events-none !z-[10]`}
                  aria-haspopup="dialog"
                  aria-expanded="false"
                  aria-controls="hs-application-sidebar"
                  aria-label="Toggle navigation"
                  data-hs-overlay="#hs-application-sidebar"
                  onClick={()=>setWhichModalOpen('sidebar')}
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
                    <div className="hs-dropdown relative inline-flex items-center space-x-2 sm:space-x-4">
                      <button
                        type="button"
                        onClick={() => {
                          setWhichModalOpen("updateUser");
                        }}
                        className="flex flex-wrap items-center group"
                      >
                        {/* <span className='text-lg text-light-black mr-3'>Welcome, ZillionLinx Demo</span> */}
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
                      onClick={handleLogout}
                    >
                      Logout
                    </button>
                    <svg
                      onClick={handleLogout}
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
                {userRole === "user" ? (
                  <>
                    <button
                      type="button"
                      className="relative size-4 sm:size-9 flex justify-center items-center text-sm font-semibold rounded-lg border border-transparent text-gray-800 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none dark:text-white dark:border-transparent dark:hover:bg-neutral-700 dark:focus:bg-neutral-700"
                      aria-haspopup="dialog"
                      aria-expanded="false"
                      aria-controls="hs-header-base-offcanvas"
                      aria-label="Toggle navigation"
                      data-hs-overlay="#hs-header-base-offcanvas"
                    >
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="size-4 sm:size-6 shrink-0"
                      >
                        <g clipPath="url(#clip0_3_191)">
                          <path
                            d="M12 0C5.37264 0 0 5.37264 0 12C0 17.6275 3.87456 22.3498 9.10128 23.6467V15.6672H6.62688V12H9.10128V10.4198C9.10128 6.33552 10.9498 4.4424 14.9597 4.4424C15.72 4.4424 17.0318 4.59168 17.5685 4.74048V8.06448C17.2853 8.03472 16.7933 8.01984 16.1822 8.01984C14.2147 8.01984 13.4544 8.76528 13.4544 10.703V12H17.3741L16.7006 15.6672H13.4544V23.9122C19.3963 23.1946 24.0005 18.1354 24.0005 12C24 5.37264 18.6274 0 12 0Z"
                            fill="#2131E5"
                          />
                        </g>
                        <defs>
                          <clipPath id="clip0_3_191">
                            <rect width="24" height="24" fill="white" />
                          </clipPath>
                        </defs>
                      </svg>
                    </button>

                    <button
                      type="button"
                      className="relative size-4 sm:size-9 flex justify-center items-center text-sm font-semibold rounded-lg border border-transparent text-gray-800 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none dark:text-white dark:border-transparent dark:hover:bg-neutral-700 dark:focus:bg-neutral-700"
                      aria-haspopup="dialog"
                      aria-expanded="false"
                      aria-controls="hs-header-base-offcanvas"
                      aria-label="Toggle navigation"
                      data-hs-overlay="#hs-header-base-offcanvas"
                    >
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="size-4 sm:size-6 shrink-0"
                      >
                        <path
                          d="M18.3263 1.90391H21.6998L14.3297 10.3274L23 21.7899H16.2112L10.894 14.8379L4.80995 21.7899H1.43443L9.31744 12.78L1 1.90391H7.96111L12.7674 8.25824L18.3263 1.90391ZM17.1423 19.7707H19.0116L6.94539 3.81704H4.93946L17.1423 19.7707Z"
                          fill="#2131E5"
                        />
                      </svg>
                    </button>
                    <button
                      type="button"
                      className="relative size-4 sm:size-9 flex justify-center items-center text-sm font-semibold rounded-lg border border-transparent text-gray-800 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none dark:text-white dark:border-transparent dark:hover:bg-neutral-700 dark:focus:bg-neutral-700"
                      aria-haspopup="dialog"
                      aria-expanded="false"
                      aria-controls="hs-header-base-offcanvas"
                      aria-label="Toggle navigation"
                      data-hs-overlay="#hs-header-base-offcanvas"
                    >
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="size-4 sm:size-6 shrink-0"
                      >
                        <g clipPath="url(#clip0_55_183)">
                          <path
                            d="M11.9998 9.81815V14.4654H18.4579C18.1743 15.96 17.3233 17.2255 16.047 18.0764L19.9415 21.0982C22.2106 19.0037 23.5197 15.9273 23.5197 12.2728C23.5197 11.4219 23.4433 10.6037 23.3015 9.81828L11.9998 9.81815Z"
                            fill="#2131E5"
                          />
                          <path
                            d="M5.27461 14.284L4.39625 14.9564L1.28711 17.3782C3.26165 21.2945 7.30862 24 11.9995 24C15.2394 24 17.9557 22.9309 19.9412 21.0982L16.0467 18.0764C14.9776 18.7964 13.614 19.2328 11.9995 19.2328C8.87951 19.2328 6.22868 17.1273 5.27952 14.2909L5.27461 14.284Z"
                            fill="#2131E5"
                          />
                          <path
                            d="M1.28718 6.62182C0.469042 8.2363 0 10.0581 0 11.9999C0 13.9417 0.469042 15.7636 1.28718 17.378C1.28718 17.3889 5.27997 14.2799 5.27997 14.2799C5.03998 13.5599 4.89812 12.7963 4.89812 11.9998C4.89812 11.2033 5.03998 10.4397 5.27997 9.71975L1.28718 6.62182Z"
                            fill="#2131E5"
                          />
                          <path
                            d="M11.9997 4.77818C13.767 4.77818 15.3379 5.38907 16.5925 6.56727L20.0288 3.13095C17.9452 1.18917 15.2398 0 11.9997 0C7.30887 0 3.26165 2.69454 1.28711 6.62183L5.27978 9.72001C6.22882 6.88362 8.87976 4.77818 11.9997 4.77818Z"
                            fill="#2131E5"
                          />
                        </g>
                        <defs>
                          <clipPath id="clip0_55_183">
                            <rect width="24" height="24" fill="white" />
                          </clipPath>
                        </defs>
                      </svg>
                    </button>
                  </>
                ) : null}
                {isLoggedIn && userRole === "user" ? (
                  <nav className="justify-end ml-3 hidden xl:flex flex-wrap">
                    <button
                    onClick={redirectTo}
                      className="px-4 xl:px-6 py-4 xl:py-5 text-tabs text-base xl:text-lg bg-navy tracking-wide rounded-tl-[20px] inline-flex items-center hover:text-blue-600 focus:outline-none focus:text-blue-600 disabled:opacity-50 disabled:pointer-events-none hs-tab-active:font-semibold hs-tab-active:border-blue-600 hs-tab-active:text-blue-600"
                    >
                      My Bookmarks
                    </button>
                    {/* btnRef.current.click(); */}
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
