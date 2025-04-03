import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useOutletContext } from "react-router-dom";
import { toast } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import {
  addToBookmarks,
  callTopLinks,
  fetchAllTopLinks,
  fetchCategoryWiseBookmarks,
  orderBookmarks,
  removeFromBookmarks,
  removeTopLink,
} from "../redux/slices/bookmarkSlice";
import Bookmark from "../components/Bookmark";
import GoogleSearchbar from "../components/GoogleSearchbar";
import AddNewBookmarkField from "../components/AddNewBookmarkField";
import Sidebar from "../components/Sidebar";
import Searchbar from "../components/Searchbar";
import AddRemoveBookmarkContext from "../components/AddRemoveBookmarkContext";

const MyBookmarks = () => {
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
    closeAllModals,
  } = useOutletContext();
  const [contextMenu, setContextMenu] = useState(null);

  const handleRightClick = (event, record) => {
    event.preventDefault();
    setContextMenu({
      x: event.clientX,
      y: event.clientY,
      record: record,
    });
  };

  const handleOptionClick = async (option) => {
    let bookmark_id = contextMenu?.record?.bookmark_id;
    if (option === "add") {
      try {
        let result = await dispatch(
          addToBookmarks({ token, bookmark_id })
        ).unwrap();
        if (result !== "") {
          toast.success(result);
        }
      } catch (error) {
        console.log(error, "Error while adding bookmark to top links");
        toast.error(error.message || "Failed to add bookmark to top links");
      }
    } else {
      try {
        let result = await dispatch(
          removeFromBookmarks({ token, bookmark_id })
        ).unwrap();
        dispatch(fetchAllTopLinks(token));
        if (result) {
          toast.success(result);
        }
      } catch (error) {
        console.log(error, "Error while removing bookmark from top links");
        toast.error(
          error.message || "Failed to removing bookmark from top links"
        );
      }
    }
    setContextMenu(null);
  };

  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const loginMessage = location?.state?.loginMessage
    ? location?.state?.loginMessage
    : "";
  const { token } = useSelector((state) => state.auth);
  const { categories } = useSelector((state) => state.category);
  const {
    bookmarks,
    loading,
    error,
    isTopLink,
    bookmark_addto,
    bookmark_category,
    bookmark_subcategory,
  } = useSelector((state) => state.bookmark);

  const [draggedItemId, setDraggedItemId] = useState(null);
  const [searchResults, setSearchResults] = useState(false);

  useEffect(() => {
    if (loginMessage) {
      toast.success(loginMessage);
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [loginMessage]);

  useEffect(() => {
    const fetchData = async () => {
      dispatch(callTopLinks());
      await dispatch(fetchAllTopLinks(token));
    };
    if (token && (bookmark_addto === "top_link" || bookmark_addto === "")) {
      fetchData();
    }
  }, [dispatch, token, bookmark_addto]);

  // When drag starts, store the item's index
  const handleDragStart = (itemId) => {
    setDraggedItemId(itemId);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  // When dragged over another item, reorder the list
  const handleDrop = async (itemId) => {
    if (draggedItemId === null || draggedItemId === itemId) return;

    // Ensure bookmarks.bookmarks is an array
    const newItems = Array.isArray(bookmarks) ? [...bookmarks] : [];

    // Separate pinned and unpinned bookmarks
    const pinnedBookmarks = newItems.filter((item) => item.pinned === 1);
    const unpinnedBookmarks = newItems.filter((item) => item.pinned === 0);

    // Check if dragged item is pinned
    const draggedItems = newItems.find((item) => item.id === draggedItemId);
    if (draggedItems?.pinned === 1) {
      toast.error("Pinned bookmarks cannot be rearranged!");
      return;
    }

    // Check if dropping over a pinned item
    const targetItem = newItems.find((item) => item.id === itemId);
    if (targetItem?.pinned === 1) {
      toast.error("You cannot drop over pinned bookmarks!");
      return;
    }

    // Find indexes
    const draggedIndex = unpinnedBookmarks.findIndex(
      (item) => item.id === draggedItemId
    );
    const targetIndex = unpinnedBookmarks.findIndex(
      (item) => item.id === itemId
    );

    if (draggedIndex === -1 || targetIndex === -1) return;

    // Reorder items
    const [draggedItem] = unpinnedBookmarks.splice(draggedIndex, 1);
    unpinnedBookmarks.splice(targetIndex, 0, draggedItem);

    setDraggedItemId(null);
    const updatedBookmarks = [...pinnedBookmarks, ...unpinnedBookmarks];

    // Generate the order array for API
    const order = updatedBookmarks.map((item) => item.id);

    const result = await dispatch(orderBookmarks({ token, order }));
    if (orderBookmarks.fulfilled.match(result)) {
      toast.success(result.payload || "Bookmarks re-arranged successfully!");
      if (id?.categoryId) {
        let categoryId = id?.categoryId;
        let subCategoryId = id?.subCategoryId;
        await dispatch(
          fetchCategoryWiseBookmarks({ token, categoryId, subCategoryId })
        );
      } else {
        await dispatch(fetchAllTopLinks(token));
      }
    } else {
      toast.error(result.payload || "Failed to re-arrange bookmarks.");
    }
  };

  // Remove Bookmark
  const handleRemoveItem = async (topLinkId) => {
    const result = await dispatch(removeTopLink({ token, topLinkId }));
    if (removeTopLink.fulfilled.match(result)) {
      toast.success(result.payload.message || "Top link removed successfully!");
      if (id?.categoryId !== null) {
        let categoryId = id?.categoryId;
        let subCategoryId = id?.subCategoryId;
        await dispatch(
          fetchCategoryWiseBookmarks({ token, categoryId, subCategoryId })
        );
      } else {
        await dispatch(fetchAllTopLinks(token));
      }
    } else {
      toast.error(result.payload || "Failed to remove top link.");
    }
  };

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
        subCategoryId: subCategoryId,
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
    <div className="max-w-screen-3xl mx-auto px-4 sm:px-6 xl:px-2 h-full">
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
              fixed xl:relative inset-y-0 start-0 z-[50] xl:block
            `}
            role="dialog"
            tabIndex="-1"
            aria-label="Sidebar"
          >
            <Searchbar setSearchResults={setSearchResults} />
            <Sidebar setId={setId} id={id} />
          </div>

          <div className="bookmark-content-wrapper h-full">
            <div className="flex flex-wrap md:items-center justify-between flex-col md:flex-row">
              <div className="flex flex-wrap items-center gap-2">
                <AddNewBookmarkField
                  setWhichModalOpen={setWhichModalOpen}
                  setUrlToBookmark={setUrlToBookmark}
                />
              </div>
              <GoogleSearchbar />
            </div>
            <div className="rounded-2xl bg-white p-6 md:h-[calc(100%-66px)]">
              <p className="flex flex-wrap flex-col md:flex-row md:items-center gap-x-4 text-lg md:text-xl xl:text-[28px] text-dark-blue capitalize mb-5">
                {isTopLink ? (
                  <span>Top Links</span>
                ) : id?.categoryId ? (
                  `${selectedCategory?.title} ${
                    selectedSubCategory?.title
                      ? `| ${selectedSubCategory?.title}`
                      : ""
                  }`
                ) : searchResults ? (
                  "Search Results"
                ) : (
                  ""
                )}
                {!id?.categoryId && !searchResults ? (
                  <span className="text-base text-light-black inline-block">
                    Drag thumbnails to desired position, pin to a grid location,
                    or right-click for more options.
                  </span>
                ) : null}
              </p>
              <div className="rounded-xl border border-light-blue p-6 overflow-auto custom-scrollbar h-[calc(100%-62px)]">
                {loading ? (
                  <span className="loader"></span>
                ) : bookmarks?.length > 0 && !error ? (
                  <>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 2xl:grid-cols-3 gap-7">
                      {bookmarks && bookmarks?.length > 0 ? (
                        bookmarks?.map((bookmark, index) => (
                          <li
                            key={bookmark?.id}
                            draggable
                            onDragStart={() => handleDragStart(bookmark?.id)}
                            onDragOver={handleDragOver}
                            onDrop={() => handleDrop(bookmark.id)}
                            onContextMenu={(e) => handleRightClick(e, bookmark)}
                            className="relative"
                            style={{
                              opacity: draggedItemId === index ? 0.5 : 1,
                            }}
                          >
                            <Bookmark
                              item={bookmark}
                              handleRemoveItem={handleRemoveItem}
                              categoryId={id?.categoryId}
                              subCategoryId={id?.subCategoryId}
                              setId={setId}
                            />
                          </li>
                        ))
                      ) : (
                        <></>
                      )}
                    </ul>
                    {contextMenu && (
                      <AddRemoveBookmarkContext
                        handleRemoveItem={handleRemoveItem}
                        contextMenu={contextMenu}
                        setContextMenu={setContextMenu}
                        handleOptionClick={handleOptionClick}
                      />
                    )}
                  </>
                ) : (
                  <div className=" flex justify-center items-center">
                    {/* <h2 className="text-[22px] text-red-500 mb-5">{error}</h2> */}
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

export default MyBookmarks;
