import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { toast } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchAllTopLinks,
  fetchCategoryWiseBookmarks,
  orderBookmarks,
  removeTopLink
} from "../redux/slices/bookmarkSlice";
import Bookmark from "../components/Bookmark";
import GoogleSearchbar from "../components/GoogleSearchbar";
import AddNewBookmarkField from "../components/AddNewBookmarkField";
import Sidebar from "../components/Sidebar";
import Searchbar from "../components/Searchbar";
import { logout } from "../redux/slices/authSlice";

const MyBookmarks = () => {
  const {
    setUrlToBookmark,
    setWhichModalOpen,
    selectedCategory,
    selectedSubCategory,
    id,
    setId
  } = useOutletContext();

  const dispatch = useDispatch();
  

  const { token } = useSelector((state) => state.auth);
  const { bookmarks, loading, error, isTopLink } = useSelector(
    (state) => state.bookmark
  );

  const [draggedItemId, setDraggedItemId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      let result = await dispatch(fetchAllTopLinks(token));
      if (fetchAllTopLinks.fulfilled.match(result)) {
        //Do not need to show success message using toast while getting data on load
        // toast.success(result.payload.message || "Categories fetched successfully!")
      } else {
        // toast.error(result.payload || "Failed to fetch Top Links!");
      }
    };
    if (token ) {
      fetchData();
    }    
  }, [dispatch, token]);

  // When drag starts, store the item's index
  const handleDragStart = (itemId) => {
    setDraggedItemId(itemId);
  };

  const handleDragOver = (event) => {
    event.preventDefault(); // Required to allow dropping
  };
  // When dragged over another item, reorder the list
  const handleDrop = async (itemId) => {
    if (draggedItemId === null || draggedItemId === itemId) return;

    // Ensure bookmarks.bookmarks is an array
    const newItems = Array.isArray(bookmarks?.bookmarks)
      ? [...bookmarks.bookmarks]
      : [];

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
    // console.log(order, "New Order Array");

    const result = await dispatch(orderBookmarks({ token, order }));
    if (orderBookmarks.fulfilled.match(result)) {
      toast.success(result.payload || "Bookmarks re-arranged successfully!");
      if(id?.categoryId) {
        let categoryId = id?.categoryId;
        let subCategoryId = id?.subCategoryId;
        await dispatch(fetchCategoryWiseBookmarks({token, categoryId, subCategoryId}));
      }
      else {
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
      await dispatch(fetchAllTopLinks(token));
    } else {
      toast.error(result.payload || "Failed to remove top link.");
    }
  };

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
          <div
            id="hs-application-sidebar"
            className={`
                bookmark-sidebar-wrapper    
                hs-overlay [--auto-close:lg]
                hs-overlay-open:translate-x-0         
                -translate-x-full lg:translate-x-0 transition-all duration-300 transform
                fixed lg:relative inset-y-0 start-0 z-[40] lg:block
            `}
            role="dialog"
            tabIndex="-1"
            aria-label="Sidebar"
          >
            <Searchbar />
            <Sidebar setId={setId} />
          </div>

          <div className="bookmark-content-wrapper">
            <div className="flex flex-wrap items-center justify-between">
              <AddNewBookmarkField
                setWhichModalOpen={setWhichModalOpen}
                setUrlToBookmark={setUrlToBookmark}
              />
              <GoogleSearchbar />
            </div>
            {/* /************** */}
            <div className="rounded-2xl bg-white p-6 h-[calc(100%-64px)]">
              <p className="text-[28px] text-dark-blue capitalize mb-5 pt-6">
                {isTopLink
                  ? "Top Links"
                  : id?.categoryId
                  ? `${selectedCategory?.title} ${
                      selectedSubCategory?.title
                        ? `| ${selectedSubCategory?.title}`
                        : ""
                    }`
                  : ""}
                {!id?.categoryId ? (
                  <span className="text-base text-light-black inline-block ml-4">
                    (Drag and drop thumbnails to position top links or pin to a
                    grid location)
                  </span>
                ) : null}
              </p>
              {console.log(bookmarks, 's')}
              <div className="rounded-xl border border-light-blue p-6 overflow-auto custom-scrollbar h-[calc(100vh-66px)]">
                {loading ? (
                  <span className="loader"></span>
                ) : bookmarks?.length === 0 && error ? (
                  <h2 className="text-[22px] text-red-500 mb-5">{error}</h2>
                ) : (
                  <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 2xl:grid-cols-3 gap-7">
                    {bookmarks &&
                    bookmarks?.length > 0 ? (
                      bookmarks?.map((bookmark, index) => (
                        <li
                        key={bookmark?.id}
                        draggable
                        onDragStart={() => handleDragStart(bookmark?.id)}
                        onDragOver={handleDragOver}
                        onDrop={() => handleDrop(bookmark.id)}
                        className="relative"
                        style={{ opacity: draggedItemId === index ? 0.5 : 1 }}
                        >
                          <Bookmark
                            item={bookmark}
                            handleRemoveItem={handleRemoveItem}
                            categoryId={id?.categoryId}
                            subCategoryId={id?.subCategoryId}
                          />
                        </li>
                      ))
                    ) : (
                      <li className="col-span-2 text-[22px] text-red-500 mb-5">
                        {bookmarks?.message}
                      </li>
                    )}
                  </ul>
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
