import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { disabledTopLinks, searchBookmarks } from "../redux/slices/bookmarkSlice";

const Searchbar = ({setSearchResults, closeAllModals}) => {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const [title, setTitle] = useState("");

  const handleSearch = (e) => {
    e.preventDefault(); 
    if (title.trim() !== "") {
        let formData = new FormData();
        formData.append("title", title);
      dispatch(searchBookmarks({ token, formData }));
      setSearchResults(true);
      dispatch(disabledTopLinks());
      closeAllModals()
    }
  };

  return (
    <form className="flex items-center rounded-xl shadow-sm mb-4 relative" onSubmit={handleSearch}>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          type="text"
          placeholder="Search my Bookmarks"
          id="hs-trailing-button-add-on-with-icon"
          name="hs-trailing-button-add-on-with-icon"
          className="h-[48px] py-3 pl-4 pr-14 block w-full border-gray-200 rounded-xl text-sm placeholder:text-lg placeholder:text-light-black/48 focus:z-10 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
        />
        <button
          type="submit"
          // onClick={handleSearch}
          className="absolute z-20 right-2 top-1 w-[40px] h-[40px] shrink-0 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-xl border border-transparent bg-dark-blue text-white hover:bg-blue-700 focus:outline-none focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
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
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.3-4.3"></path>
          </svg>
        </button>
    </form>
  );
};

export default Searchbar;
