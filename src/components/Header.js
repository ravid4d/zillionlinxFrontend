import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { logout } from "../redux/slices/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { callTopLinks } from "../redux/slices/bookmarkSlice";

const Header = ({ setWhichModalOpen }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isLoggedIn, userRole } = useSelector((state) => state.auth);

  const handleLogout = async () => {
    try {
      await dispatch(logout());
      toast.success("You have been logged out successfully!");
      navigate("/");
    } catch (error) {
      toast.error("Logout failed! Please try again.");
    }
  };
  return (
    <header className="flex flex-wrap  md:justify-start md:flex-nowrap z-40 w-full">
      <nav className="relative max-w-screen-2xl w-full mx-auto md:flex md:items-center md:justify-between md:gap-3 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end gap-x-1">
          <div
            onClick={() => dispatch(callTopLinks())}
            className="flex flex-wrap items-center font-semibold text-xl text-black focus:outline-none focus:opacity-80 w-72 h-16 cursor-pointer"
            to={isLoggedIn ? "/bookmarks" : "/"}
            aria-label="Brand"
          >
            <img
              src="/logo.svg"
              alt=""
              className="max-w-full max-h-full block"
            />
          </div>

          <button
            type="button"
            className="hs-collapse-toggle md:hidden relative size-9 flex justify-center items-center font-medium text-[12px] rounded-lg border border-gray-200 text-gray-800 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none"
            id="hs-header-base-collapse"
            aria-expanded="false"
            aria-controls="hs-header-base"
            aria-label="Toggle navigation"
            data-hs-collapse="#hs-header-base"
          >
            <svg
              className="hs-collapse-open:hidden size-4"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="3" x2="21" y1="6" y2="6" />
              <line x1="3" x2="21" y1="12" y2="12" />
              <line x1="3" x2="21" y1="18" y2="18" />
            </svg>
            <svg
              className="hs-collapse-open:block shrink-0 hidden size-4"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
            <span className="sr-only">Toggle navigation</span>
          </button>
        </div>

        <div
          id="hs-header-base"
          className="hs-collapse hidden overflow-hidden transition-all duration-300 basis-full grow md:block "
          aria-labelledby="hs-header-base-collapse"
        >
          <div className="overflow-hidden overflow-y-auto max-h-[75vh] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300">
            <div className="py-2 md:py-0  flex flex-col md:flex-row md:items-center gap-0.5 md:gap-1">
              <div className="md:ms-auto mt-2 md:mt-0 flex flex-wrap items-center gap-x-1.5">
                {isLoggedIn && userRole === "user" ? (
                  <>
                    <div className="hs-dropdown relative inline-flex items-center space-x-4">
                      <Link
                        to="/bookmarks"
                        className="flex flex-wrap items-center group"
                      >
                        {/* <span className='text-lg text-light-black mr-3'>Welcome, ZillionLinx Demo</span> */}
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={2}
                          stroke="currentColor"
                          className="size-6 text-dark-blue group-hover:text-navy"
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
                      </Link>
                      <Link to="/quick-access" className="group">
                        <svg
                          width="26"
                          height="26"
                          viewBox="0 0 26 26"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          className="fill-dark-blue group-hover:fill-navy"
                        >
                          <g clipPath="url(#clip0_43_71)">
                            <path d="M22.1996 22.7022L18.9902 24.5559C17.9116 25.1789 16.7533 25.4905 15.5954 25.4906C14.4373 25.4906 13.2795 25.1791 12.2007 24.5559L4.90004 20.3419C4.5762 20.1548 4.34439 19.8516 4.24714 19.4882C4.14984 19.1248 4.19931 18.7464 4.38633 18.4227C4.81335 17.6824 5.48432 17.1477 6.27555 16.9174C7.082 16.6826 7.93457 16.7893 8.67613 17.2179L10.7413 18.41L4.36434 7.36445C4.08231 6.87537 4.00801 6.30404 4.15492 5.7555C4.30204 5.20635 4.65263 4.74881 5.14201 4.46702C5.63002 4.18473 6.20161 4.11003 6.75071 4.25709C7.29955 4.40405 7.75745 4.75414 8.04014 5.24286L10.9894 10.3527C11.1527 9.85532 11.4874 9.44201 11.9419 9.18039C12.711 8.73636 13.6463 8.8305 14.3081 9.34527C14.4322 8.78338 14.7822 8.27328 15.3181 7.96387C16.1773 7.46926 17.242 7.64425 17.9027 8.32503C18.0527 7.84982 18.3693 7.45443 18.8018 7.20525C19.258 6.94098 19.7921 6.87065 20.3054 7.00781C20.8193 7.14513 21.2481 7.47317 21.5128 7.93147L24.6858 13.4268C26.5574 16.6704 25.4421 20.8313 22.1996 22.7023V22.7022ZM4.066 2.60447C6.10817 1.42584 8.72864 2.12779 9.90773 4.1695C10.1452 4.58032 10.3116 5.0243 10.4023 5.4891C10.4829 5.902 10.8827 6.1715 11.2958 6.09091C11.7087 6.01037 11.9782 5.61036 11.8976 5.19741C11.7746 4.56656 11.5488 3.96414 11.2268 3.40727C9.62792 0.638574 6.07395 -0.313473 3.30429 1.28507C0.535641 2.88397 -0.416456 6.43795 1.18148 9.20644C1.50313 9.76564 1.91202 10.2624 2.39672 10.6832C2.54089 10.8083 2.71868 10.8696 2.8957 10.8696C3.10873 10.8696 3.32069 10.7807 3.47131 10.6072C3.74705 10.2894 3.71302 9.80835 3.39529 9.53261C3.03931 9.22365 2.73873 8.85833 2.50148 8.44594C1.32285 6.40382 2.0248 3.78336 4.066 2.60452V2.60447Z" />
                          </g>
                          <defs>
                            <clipPath id="clip0_43_71">
                              <rect width="26" height="26" fill="white" />
                            </clipPath>
                          </defs>
                        </svg>
                      </Link>
                    </div>
                    <div className="my-2 md:my-0 md:mx-4">
                      <div className="w-full h-px md:w-px md:h-4 bg-mid-blue dark:bg-neutral-700"></div>
                    </div>
                  </>
                ) : null}
                {isLoggedIn ? (
                  <>
                    {/* aria-haspopup="dialog" aria-expanded="false" aria-controls="add-category-modal" data-hs-overlay="#add-category-modal" */}
                    {/*} <button className="btn light-btn" onClick={() => setWhichModalOpen('newCategory')}>Add New Category</button>*/}
                    <button className="btn dark-btn" onClick={handleLogout}>
                      Logout
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

              <div className="flex justify-end items-center gap-x-1 ms-2">
                {userRole === "user" ? (
                  <>
                    <button
                      type="button"
                      className="relative size-9 flex justify-center items-center text-sm font-semibold rounded-lg border border-transparent text-gray-800 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none dark:text-white dark:border-transparent dark:hover:bg-neutral-700 dark:focus:bg-neutral-700"
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
                        className="size-6 shrink-0"
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
                      className="relative size-9 flex justify-center items-center text-sm font-semibold rounded-lg border border-transparent text-gray-800 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none dark:text-white dark:border-transparent dark:hover:bg-neutral-700 dark:focus:bg-neutral-700"
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
                        className="size-6 shrink-0"
                      >
                        <path
                          d="M18.3263 1.90391H21.6998L14.3297 10.3274L23 21.7899H16.2112L10.894 14.8379L4.80995 21.7899H1.43443L9.31744 12.78L1 1.90391H7.96111L12.7674 8.25824L18.3263 1.90391ZM17.1423 19.7707H19.0116L6.94539 3.81704H4.93946L17.1423 19.7707Z"
                          fill="#2131E5"
                        />
                      </svg>
                    </button>
                    <button
                      type="button"
                      className="relative size-9 flex justify-center items-center text-sm font-semibold rounded-lg border border-transparent text-gray-800 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none dark:text-white dark:border-transparent dark:hover:bg-neutral-700 dark:focus:bg-neutral-700"
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
                        className="size-6 shrink-0"
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
                  <nav className="flex justify-end ml-3">
                    <Link
                      to="/bookmarks"
                      className="px-6 py-5 text-tabs text-lg bg-navy tracking-wide rounded-tl-[20px] inline-flex items-center hover:text-blue-600 focus:outline-none focus:text-blue-600 disabled:opacity-50 disabled:pointer-events-none hs-tab-active:font-semibold hs-tab-active:border-blue-600 hs-tab-active:text-blue-600"
                    >
                      My Bookmarks
                    </Link>
                    {/* btnRef.current.click(); */}
                    <button
                      type="button"
                      onClick={() => {
                        setWhichModalOpen("newBookmark");
                      }}
                      className="px-6 py-5 text-tabs text-lg bg-navy tracking-wide inline-flex items-center hover:text-blue-600 focus:outline-none focus:text-blue-600 disabled:opacity-50 disabled:pointer-events-none hs-tab-active:font-semibold hs-tab-active:border-blue-600 hs-tab-active:text-blue-600"
                    >
                      Add New Bookmark
                    </button>
                    <button
                      type="button"
                      className="px-6 py-5 text-tabs text-lg bg-navy tracking-wide rounded-tr-[20px] inline-flex items-center hover:text-blue-600 focus:outline-none focus:text-blue-600 disabled:opacity-50 disabled:pointer-events-none hs-tab-active:font-semibold hs-tab-active:border-blue-600 hs-tab-active:text-blue-600"
                    >
                      Import Bookmarks
                    </button>
                  </nav>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
