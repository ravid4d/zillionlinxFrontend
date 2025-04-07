import React, { useEffect, useState } from "react";
import {
  Link,
  useLocation,
  useNavigate,
  useOutletContext
} from "react-router-dom";
import { toast } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import {
  addToBookmarks,
  callTopLinks,
  fetchAllTopLinks,
  fetchCategoryWiseBookmarks,
  removeFromBookmarks,
} from "../redux/slices/bookmarkSlice";
import GoogleSearchbar from "../components/GoogleSearchbar";
import Sidebar from "../components/Sidebar";
import Searchbar from "../components/Searchbar";
import AddRemoveBookmarkContext from "../components/AddRemoveBookmarkContext";
import BookmarkGoogleResultContext from "../components/BookmarkGoogleResultContext";

const InstantLinks = () => {
  const {
    setUrlToBookmark,
    setWhichModalOpen,
    selectedCategory,
    setSelectedCategory,
    setSelectedSubCategory,
    selectedSubCategory,
    id,
    setId,
    openModal,
    closeAllModals
  } = useOutletContext();
  const [contextMenu, setContextMenu] = useState(null);

  const handleRightClick = (event, record) => {
    console.log(record, 'record');
    event.preventDefault();
    let newRecord = {...record, link:record?.website_url};
    setContextMenu({
      x: event.clientX,
      y: event.clientY,
      record: newRecord
    });
  };

  const handleOptionClick = async (option) => {
    contextMenu.record = { ...contextMenu.record, type:option };
    setUrlToBookmark(contextMenu)
    setContextMenu(null); // Close context menu
    setWhichModalOpen("newBookmark"); 
  };

  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const { categories } = useSelector((state) => state.category);
  const {
    bookmarks,
    loading,
    error,
    isTopLink,
    bookmark_addto,
    bookmark_category,
    bookmark_subcategory
  } = useSelector((state) => state.bookmark);

  const [searchResults, setSearchResults] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      dispatch(callTopLinks());
      await dispatch(fetchAllTopLinks(token));
    };
    if (token && (bookmark_addto === "top_link" || bookmark_addto === "")) {
      fetchData();
    }
  }, [dispatch, token, bookmark_addto]);

  useEffect(() => {
    if (bookmark_addto === "top_link") {
      dispatch(fetchAllTopLinks(token));
    } else if (bookmark_addto === "bookmark") {
      let categoryId = bookmark_category;
      let subCategoryId = bookmark_subcategory ? bookmark_subcategory : "";
      const category = categories.find((cat) => cat.id === bookmark_category);

      const subCategry = category?.subcategories?.find((subCategory) =>
        bookmark_subcategory ? subCategory?.id === bookmark_subcategory : ""
      );
      setSelectedCategory(category);
      setSelectedSubCategory(subCategry);

      setId({
        categoryId: categoryId,
        subCategoryId: subCategoryId
      });
      dispatch(
        fetchCategoryWiseBookmarks({ token, categoryId, subCategoryId })
      );
    }
  }, [bookmark_addto]);

  useEffect(() => {
    if (openModal?.sidebar) {
      let sidebarOverlay = document.getElementById(
        "hs-application-sidebar-backdrop"
      );
      if (!sidebarOverlay) return;

      const handleClickOutside = () => {
        closeAllModals();
      };

      sidebarOverlay.addEventListener("click", handleClickOutside);
      return () =>
        sidebarOverlay.removeEventListener("click", handleClickOutside);
    }
  }, [openModal?.sidebar]);

  return (
    <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 xl:px-2 h-full">
      <div className="bg-navy sm:rounded-tl-[20px] rounded-bl-[20px] rounded-br-[20px] p-4 xl:p-8 h-full">
        <div className="flex flex-wrap xl:space-x-8 h-full">
          <div
            id="hs-application-sidebar"
            className={`
              h-full
              bookmark-sidebar-wrapper    
              hs-overlay [--auto-close:xl]
              ${
                openModal?.sidebar ? "translate-x-0" : "-translate-x-full"
              }       
               xl:translate-x-0 transition-all duration-300 transform
              fixed xl:relative inset-y-0 start-0 z-[50] xl:z-[37] xl:block
            `}
            role="dialog"
            tabIndex="-1"
            aria-label="Sidebar"
          >
            <Searchbar
              closeAllModals={closeAllModals}
              setSearchResults={setSearchResults}
            />
            <Sidebar setId={setId} id={id} />
          </div>

          <div className="bookmark-content-wrapper h-full">
            <div className="flex flex-wrap md:items-center justify-between flex-col md:flex-row">
              <div className="flex flex-wrap items-center gap-2"></div>
              <GoogleSearchbar />
            </div>
            <div className="rounded-2xl bg-white p-6 md:h-[calc(100%-66px)]">
              <p className="flex flex-wrap flex-col md:flex-row md:items-center gap-x-4 text-lg md:text-xl xl:text-[28px] text-dark-blue capitalize mb-5">
                Instand Links
              </p>
              <div className="rounded-xl border border-light-blue p-6 overflow-auto custom-scrollbar h-[calc(100%-62px)]">
                {loading ? (
                  <span className="loader"></span>
                ) : bookmarks?.length > 0 && !error ? (
                  <>
                    <ul>
                      {bookmarks && bookmarks?.length > 0 ? (
                        bookmarks?.map((bookmark) => (
                          <li
                            key={bookmark?.id}
                            draggable
                            onContextMenu={(e) => handleRightClick(e, bookmark)}
                            className="relative"
                          >
                              <span>
                                <Link
                                  target="_blank"
                                  to={bookmark?.website_url}
                                >
                                  <span className="text-[16px] py-2 px-4 font-semibold hover:text-dark-blue">
                                    {bookmark?.title}
                                  </span>
                                </Link>
                              </span>
                          </li>
                        ))
                      ) : (
                        <></>
                      )}
                    </ul>
                    {contextMenu && (
                      <BookmarkGoogleResultContext setContextMenu={setContextMenu} contextMenu={contextMenu} handleOptionClick={handleOptionClick}  />
                    )}
                  </>
                ) : (
                  <div className=" flex justify-center items-center">
                    <img src="./no-data-concept.jpeg" alt="No Data Found!" />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstantLinks;
