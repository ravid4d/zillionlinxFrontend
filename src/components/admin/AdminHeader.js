import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../../redux/slices/authSlice";
import { toast } from "react-toastify";
import { setSearchQuery } from "../../redux/slices/adminSlice";
import { clearImportBookmarksMessage } from "../../redux/slices/bookmarkSlice";
import { clearUser } from "../../redux/slices/userSlice";

const AdminHeader = ({setOpenSidebar, openSidebar}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [toggleProfileDropdown, setToggleProfileDropdown] = useState(false);
  const searchRef = useRef(null);
  const profileDropdownRef = useRef(null);
  const [searchField, setSearchField] = useState(false);
  const { user } = useSelector((state) => state.user);
  const { searchQuery } = useSelector((state) => state.admin);

  const handleSearchChange = async (e) => {
    await dispatch(setSearchQuery(e.target.value));
  };

  const handleLogout = async () => {
    try {
      // localStorage.removeItem("token"); // Remove token from local storage
      dispatch(logout()); // Dispatch a logout action if using Redux
      dispatch(clearUser());
      toast.success("You have been logged out successfully!");
      navigate("/"); // Redirect to home or login page
    } catch (error) {
      toast.error("Logout failed! Please try again.");
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchField(false);
      }
    };

      document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [searchRef]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(event.target)
      ) {
        setToggleProfileDropdown(false);
      }
    }
      document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [profileDropdownRef]);
  return (
    <>
      <header className="sticky top-0 inset-x-0 flex flex-wrap md:justify-start md:flex-nowrap z-50 w-full bg-white border-b border-gray-200 text-sm py-2.5 lg:ps-64">
        <nav className="px-4 sm:px-6 flex basis-full items-center w-full mx-auto">
          <div className="me-5 lg:me-0 lg:hidden flex items-center">
            <Link
              className="flex-none rounded-xl text-xl inline-block font-semibold focus:outline-hidden focus:opacity-80"
              to="/"
            >
              <span className="flex flex-wrap items-center font-semibold text-xl text-black focus:outline-none focus:opacity-80 w-40 h-16">
                <img
                  src="/logo.svg"
                  alt=""
                  className="max-w-full max-h-full block"
                />
              </span>
            </Link>
          </div>

          <div className="w-full flex items-center justify-end ms-auto md:justify-between gap-x-1 md:gap-x-3">
            <div className=""  ref={searchRef}>
              <button
                type="button"
                className="md:hidden size-9 relative inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-full border border-transparent text-gray-800 hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none"
                onClick={() => setSearchField((prev) => !prev)}
              >
                <svg
                  className="shrink-0 size-4"
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
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.3-4.3" />
                </svg>
                <span className="sr-only">Search</span>
              </button>

              <div
                className={`${
                  searchField
                    ? "block absolute top-full left-0 right-0 w-full"
                    : "hidden"
                } md:block `}               
              >
                <div className="relative">
                  <div className="absolute inset-y-0 start-0 flex items-center pointer-events-none z-20 ps-3.5">
                    <svg
                      className="shrink-0 size-4 text-gray-400"
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
                      <circle cx="11" cy="11" r="8" />
                      <path d="m21 21-4.3-4.3" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    className="py-2 ps-10 pe-16 block w-full bg-white border-gray-200 rounded-lg text-sm focus:outline-hidden focus:border-blue-500 focus:ring-blue-500 checked:border-blue-500 disabled:opacity-50 disabled:pointer-events-none"
                    placeholder="Search"
                    onChange={handleSearchChange}
                    value={searchQuery}
                  />
                  <div className="hidden absolute inset-y-0 end-0 flex items-center pointer-events-none z-20 pe-1">
                    <button
                      type="button"
                      className="inline-flex shrink-0 justify-center items-center size-6 rounded-full text-gray-500 hover:text-blue-600 focus:outline-hidden focus:text-blue-600"
                      aria-label="Close"
                    >
                      <span className="sr-only">Close</span>
                      <svg
                        className="shrink-0 size-4"
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
                        <circle cx="12" cy="12" r="10" />
                        <path d="m15 9-6 6" />
                        <path d="m9 9 6 6" />
                      </svg>
                    </button>
                  </div>
                  <div className="absolute inset-y-0 end-0 flex items-center pointer-events-none z-20 pe-3 text-gray-400">
                    <svg
                      className="shrink-0 size-3 text-gray-400"
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
                      <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
                    </svg>
                    <span className="mx-1">
                      <svg
                        className="shrink-0 size-3 text-gray-400"
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
                        <path d="M5 12h14" />
                        <path d="M12 5v14" />
                      </svg>
                    </span>
                    <span className="text-xs">/</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-row items-center justify-end gap-1">
              <button
                type="button"
                className="size-9 relative inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-full border border-transparent text-gray-800 hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none"
              >
                <svg
                  className="shrink-0 size-4"
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
                  <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
                  <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
                </svg>
                <span className="sr-only">Notifications</span>
              </button>

              <button
                type="button"
                className="size-9 relative inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-full border border-transparent text-gray-800 hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none"
              >
                <svg
                  className="shrink-0 size-4"
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
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                </svg>
                <span className="sr-only">Activity</span>
              </button>

              <div className="relative inline-flex" ref={profileDropdownRef}>
                <button
                  type="button"
                  className="size-9 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-full border border-transparent text-gray-800 focus:outline-hidden disabled:opacity-50 disabled:pointer-events-none"
                  onClick={() =>setToggleProfileDropdown(prev=>!prev)}
                >
                  <img
                    className="shrink-0 size-9 rounded-full"
                   src={`${user?.profile_image}`}
                    alt="Avatar"
                  />
                </button>
                
                  <div
                    className={`
                      ${
                      toggleProfileDropdown
                        ? "opacity-100 block"
                        : "opacity-0 hidden"
                    } 
                    absolute right-0 top-full transition-[opacity,margin] duration min-w-60 bg-white shadow-md rounded-lg mt-2`}
                  >
                    {/* <div className="py-3 px-5 bg-gray-100 rounded-t-lg">
                      <p className="text-sm text-gray-500">
                        Signed in as :{" "}
                        <span className="capitalize">{user?.role}</span>
                      </p>
                      <p className="grid grid-cols-2 text-sm font-medium text-gray-800">
                        <span className="col-span-2">
                          <span className="me-1">{user?.first_name}</span>
                          <span className="">{user?.last_name}</span>
                        </span>
                      </p>
                    </div> */}
                    <div className="py-3 px-3 bg-gray-100 rounded-t-lg flex items-center ">
                    <div className="me-3">
                      <img
                        className="shrink-0 size-9 rounded-full"
                        src={`${user?.profile_image}`}
                        alt="Avatar"
                      />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">
                        {/* Signed in as :{" "} */}
                        <span className="capitalize ">
                          {user?.role}
                        </span>
                      </p>
                      <p className="grid grid-cols-2 text-sm font-medium text-gray-800">
                        <span className="col-span-2">
                          <span className="me-1">
                            {user?.first_name}
                          </span>
                          <span className="">
                            {user?.last_name}
                          </span>
                        </span>
                        {/* <span className="col-span-2">{user?.email}</span> */}
                      </p>
                    </div>
                  </div>
                    <div className="p-1.5 space-y-0.5">
                      <Link
                        className="flex items-center gap-x-3.5 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100"
                        to="/admin/update-user"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="size-4 shrink-0"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"></path></svg>
                        Update Admin Info
                      </Link>
                      <Link
                        className="flex items-center gap-x-3.5 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100"
                        to="/admin/change-password"
                      >
                       <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="size-4 shrink-0"><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"></path></svg>
                        Change Password
                      </Link>
                      <button
                        className="w-full flex items-center gap-x-3.5 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100"
                        onClick={handleLogout}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={2}
                          stroke="currentColor"
                          className="shrink-0 size-4"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15"
                          />
                        </svg>
                        Logout
                      </button>
                    </div>
                  </div>
              </div>
            </div>
          </div>
        </nav>
      </header>
      <div className="sticky top-0 inset-x-0 z-20 bg-white border-y border-gray-200 px-4 sm:px-6 lg:px-8 lg:hidden">
        <div className="flex items-center py-2">
          <button
            type="button"
            onClick={()=>setOpenSidebar(!openSidebar)}
            className="size-8 flex justify-center items-center gap-x-2 border border-gray-200 text-gray-800 hover:text-gray-500 rounded-lg focus:outline-hidden focus:text-gray-500 disabled:opacity-50 disabled:pointer-events-none"
            // aria-haspopup="dialog"
            // aria-expanded="false"
            // aria-controls="hs-application-sidebar"
            // aria-label="Toggle navigation"
            // data-hs-overlay="#hs-application-sidebar"
          >
            <span className="sr-only">Toggle Navigation</span>
            <svg
              className="shrink-0 size-4"
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
              <rect width="18" height="18" x="3" y="3" rx="2" />
              <path d="M15 3v18" />
              <path d="m8 9 3 3-3 3" />
            </svg>
          </button>

          <ol className="ms-3 flex items-center whitespace-nowrap">
            <li className="flex items-center text-sm text-gray-800">
              Application Layout
              <svg
                className="shrink-0 mx-3 overflow-visible size-2.5 text-gray-400"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M5 1L10.6869 7.16086C10.8637 7.35239 10.8637 7.64761 10.6869 7.83914L5 14"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </li>
            <li
              className="text-sm font-semibold text-gray-800 truncate"
              aria-current="page"
            >
              Dashboard
            </li>
          </ol>
        </div>
      </div>
    </>
  );
};

export default AdminHeader;
