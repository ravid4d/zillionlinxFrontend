import React, { useEffect, useRef, useState } from "react";
import Sidebar from "../components/Sidebar";
import Searchbar from "../components/Searchbar";
import GoogleSearchbar from "../components/GoogleSearchbar";
import axios from "axios";
import '../index.css';
import { getToken } from "../services/authService";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import { fetchAllTopLinks, fetchCategoryWiseBookmarks, removeTopLink  } from "../redux/slices/bookmarkSlice";
import Bookmark from "../components/Bookmark";

const MyBookmarks = () => {
    const { token } = useSelector((state) => state.auth);
    const { topLinks, bookmarks, loading, error } = useSelector((state) => state.bookmark);
    const dispatch = useDispatch();
    const btnRef = useRef(null);
    const [inputValue, setInputValue] = useState("");
    const [id, setId] = useState({categoryId:null, subCategoryId:null});
    const [draggedIndex, setDraggedIndex] = useState(null);

    useEffect(() => {
      const fetchData = async () => {
      let result = await dispatch(fetchAllTopLinks(token));
      if (fetchAllTopLinks.fulfilled.match(result)) {
          //Do not need to show success message using toast while getting data on load
          // toast.success(result.payload.message || "Categories fetched successfully!")
        } else {
          // toast.error(result.payload || "Failed to fetch Top Links!");
        }
      }
      if(token) {
          fetchData();
      }
  }, [dispatch, token]);

    useEffect(()=>{
      if(token && id?.categoryId) {
        dispatch(fetchCategoryWiseBookmarks({ token, categoryId:id?.categoryId, subCategoryId:id?.subCategoryId }));
      }
    },[id?.categoryId, id?.subCategoryId, token])

    // When drag starts, store the item's index
    const handleDragStart = (index) => {
        setDraggedIndex(index);
    };

    // When dragged over another item, reorder the list
    const handleDragOver = (index) => {
        if (draggedIndex === null || draggedIndex === index) return;

        const newTopLinks = [...topLinks];
        const draggedItem = newTopLinks.splice(draggedIndex, 1)[0]; // Remove dragged item
        newTopLinks.splice(index, 0, draggedItem); // Insert at new position

        setDraggedIndex(index); // Update dragged index
        // setTopLinks(newTopLinks);
    };

    // Reset dragged item index on drag end
    const handleDragEnd = () => {
        setDraggedIndex(null);
    };
    
    // Remove Bookmark
    const handleRemoveItem = async ({topLinkId, type}) => {
        
        const result = await dispatch(removeTopLink({ token, topLinkId, type }));
    
        if (removeTopLink.fulfilled.match(result)) {
          toast.success(result.payload.message || "Top link removed successfully!");
        } else {
          toast.error(result.payload || "Failed to remove top link.");
        }
    };

    //Open Add New Bookmark Modal
    const addBookmarkViaUrl = () => {
        let inputField = document.getElementById("add_url_to_bookmark");
        inputField.blur();
        btnRef.current.click();
        // setOpenAddNewBookmarkModal(true);
        setTimeout(() => {
        setInputValue("");
        }, 500);
    };

    // if (status === "loading") return <p>Loading...</p>;
    // if (status === "failed") return <p>Error: {error}</p>;

  return (
    <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
      <button
        type="button"
        className="size-8 lg:hidden flex justify-center items-center gap-x-2 border border-gray-200 text-gray-800 hover:text-gray-500 rounded-lg focus:outline-none focus:text-gray-500 disabled:opacity-50 disabled:pointer-events-none"
        aria-haspopup="dialog"
        aria-expanded="false"
        aria-controls="hs-application-sidebar"
        aria-label="Toggle navigation"
        data-hs-overlay="#hs-application-sidebar"
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
      <div className="bg-navy rounded-l-[20px] rounded-br-[20px] p-8">
        <div className="flex flex-wrap lg:space-x-8">
          {/* <div className='bookmark-sidebar-wrapper'> */}
          <div
            id="hs-application-sidebar"
            className="
                bookmark-sidebar-wrapper    
                hs-overlay [--auto-close:lg]
                hs-overlay-open:translate-x-0         
                -translate-x-full lg:translate-x-0 transition-all duration-300 transform
                fixed lg:relative inset-y-0 start-0 z-[40] lg:block
            "
            role="dialog"
            tabIndex="-1"
            aria-label="Sidebar"
          >
            <Searchbar />
            <Sidebar setId={setId} />
          </div>
          {/* </div> */}
          <div className="bookmark-content-wrapper">
            <div className="flex flex-wrap items-center justify-between">
              <div className="flex items-center rounded-xl shadow-sm mb-4 relative add-url-to-bookmark w-[350px]">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Add an URL to Your Bookmarks"
                  id="add_url_to_bookmark"
                  name="add_url_to_bookmark"
                  className="h-[48px] py-3 pl-4 pr-14 block w-full border-gray-200 rounded-xl text-sm placeholder:text-lg placeholder:text-light-black/48 focus:z-10 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
                />
                <button
                  type="button"
                  onClick={addBookmarkViaUrl}
                  className="absolute z-20 right-2 top-1 w-[40px] h-[40px] inline-flex justify-center items-center border border-transparent bg-transparent hover:bg-transparent focus:outline-none focus:bg-transparent disabled:opacity-50 disabled:pointer-events-none"
                >
                  <img src="/submit-icon.png" alt="" className="" />
                </button>
              </div>
              <GoogleSearchbar />
            </div>
            <div className="rounded-2xl bg-white p-6 h-[calc(100%-64px)]">
              <p className="text-[28px] text-dark-blue capitalize mb-5 pt-6">
                Top Links{" "}
                <span className="text-base text-light-black inline-block ml-4">
                  (Drag and drop thumbnails to position top links or pin to a
                  grid location)
                </span>
              </p>
              <div className="rounded-xl border border-light-blue p-6 overflow-auto custom-scrollbar h-[calc(100vh-66px)]">
                {
                  loading ? 
                  <span className="loader"></span>
                  :
                  topLinks?.length===0 && error ? (
                    <h2 className="text-[22px] text-red-500 mb-5">
                    {error}
                  </h2>
                ) : (
                  <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 2xl:grid-cols-3 gap-7">
                    {
                      !id?.categoryId ?
                        topLinks &&
                          topLinks?.length > 0 &&
                          topLinks?.map((topLink, index) => (
                            <li
                            key={topLink?.id}
                            draggable
                            onDragStart={() => handleDragStart(topLink?.id)}
                            onDragOver={() => handleDragOver(topLink?.id)}
                            onDragEnd={handleDragEnd}
                            className="relative"
                            style={{ opacity: draggedIndex === index ? 0.5 : 1 }}
                          >
                            <Bookmark type="toplink" item={topLink} handleRemoveItem={handleRemoveItem} />
                            </li>
                          ))
                          :
                          bookmarks &&
                          bookmarks?.length > 0 &&
                          bookmarks?.map((bookmark, index) => (
                            <li
                            key={bookmark?.id}
                            draggable
                            onDragStart={() => handleDragStart(bookmark?.id)}
                            onDragOver={() => handleDragOver(bookmark?.id)}
                            onDragEnd={handleDragEnd}
                            className="relative"
                            style={{ opacity: draggedIndex === index ? 0.5 : 1 }}
                          >
                           <Bookmark type="bookmark" item={bookmark} handleRemoveItem={handleRemoveItem} />
                           </li>
                          ))
                        }
                  </ul>
                )
              }
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyBookmarks;
