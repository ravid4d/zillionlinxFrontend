import React, { useEffect, useRef, useState } from "react";
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
  clearInstantLink,
  fetchAllTopLinks,
  fetchCategoryWiseBookmarks,
  linkFrontListing,
  moveBookmarkToCategory,
  orderBookmarks,
  removeFromBookmarks,
  removeTopLink,
  setPageHeading
} from "../../redux/slices/bookmarkSlice";
import Bookmark from "../../components/bookmark/Bookmark";
import GoogleSearchbar from "../../components/elements/GoogleSearchbar";
import AddNewBookmarkField from "../../components/elements/AddNewBookmarkField";
import Sidebar from "../../components/common/Sidebar";
import Searchbar from "../../components/common/Searchbar";
import AddRemoveBookmarkContext from "../../components/bookmark/AddRemoveBookmarkContext";
import BookmarkGoogleResultContext from "../../components/bookmark/BookmarkGoogleResultContext";

const MyBookmarks = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const {
    setUrlToBookmark,
    setWhichModalOpen,
    setSelectedCategory,
    setSelectedSubCategory,
    id,
    setId,
    openModal,
    closeAllModals,
    setSearchResults,
    searchResults,
    redirectTo
  } = useOutletContext();
  const [contextMenu, setContextMenu] = useState(null);
  const [draggedItemId, setDraggedItemId] = useState(null);

  const {
    bookmarks,
    loading,
    bookmark_addto,
    bookmark_category,
    bookmark_subcategory,
    pageHeading,
    links,
    listingType
  } = useSelector((state) => state.bookmark);
  const { token } = useSelector((state) => state.auth);
  const { categories } = useSelector((state) => state.category);
  const [category, setCategory] = useState([]);
  const [selectedCat, setSelectedCat] = useState("" | null);
  const hasFetchedRef = useRef(false);
  const googleRef = useRef(null);
  
  const loginMessage = location?.state?.loginMessage
    ? location?.state?.loginMessage
    : "";

  const linkHandleRightClick = (event, record) => {
    event.preventDefault();
    let newRecord = { ...record, link: record?.website_url };
    setContextMenu({
      x: event.clientX,
      y: event.clientY,
      record: newRecord
    });
  };

  const linkHandleOptionClick = async (option) => {
    contextMenu.record = { ...contextMenu.record, type: option };
    setUrlToBookmark(contextMenu);
    setContextMenu(null); // Close context menu
    setWhichModalOpen("newBookmark");
  };

  const handleRightClick = (event, record) => {
    event.preventDefault();
    setContextMenu({
      x: event.clientX,
      y: event.clientY,
      record: record
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
          dispatch(fetchAllTopLinks(token));
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
  const handleDragStart = (e, itemId) => {
    setDraggedItemId(itemId);
    e.dataTransfer.setData('text/plain', itemId);
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
      setContextMenu(null);
    } else {
      toast.error(result.payload || "Failed to remove top link.");
    }
  };

  useEffect(() => {
    if (bookmark_addto === "top_link") {
      dispatch(fetchAllTopLinks(token));
      dispatch(setPageHeading("Top Links"));
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
      dispatch(setPageHeading(
        subCategry?.title 
          ? `${category?.title} | ${subCategry.title}` 
          : `${category?.title}`
      ));
      // dispatch(setPageHeading(`${category?.title} | ${subCategry?.title}`));
    }
    dispatch(clearInstantLink());
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

  useEffect(() => {
    if (links && links.length > 0) {
      const uniqueCategories = [
        ...new Set(links.map((link) => link.category).filter(Boolean))
      ];
      if (JSON.stringify(uniqueCategories) !== JSON.stringify(category)) {
        setCategory(uniqueCategories);
        setSelectedCat(uniqueCategories[0]); // auto-select first
      }
    }
  }, [links]);

  useEffect(() => {
    if (!hasFetchedRef.current) {
      dispatch(linkFrontListing({ token }));
      hasFetchedRef.current = true;
    }
  }, []);

  const getSubCategoryGroups = () => {
    const filteredLinks = links.filter((link) => link.category === selectedCat);

    const grouped = filteredLinks.reduce((acc, link) => {
      const subCategory = link.sub_category || "Uncategorized";
      if (!acc[subCategory]) {
        acc[subCategory] = [];
      }
      acc[subCategory].push(link);
      return acc;
    }, {});

    return grouped;
  };

const handleDropToCategory = async(data) => {
  try {
    let result = await dispatch(moveBookmarkToCategory(data));
    dispatch(fetchAllTopLinks(token));
    if (result.payload.message) {
      toast.success(result?.payload?.message);
    }
  } catch (error) {
    console.log(error, "Error while changing bookmark category");
    toast.error(
      error.message || "Failed to changing bookmark category"
    );
  }
};
   useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://cse.google.com/cse.js?cx=96b337026d2404c75";
    script.async = true;
    document.body.appendChild(script);
  }, []);
  return (
    <div className="max-w-screen-xl mx-auto px-4 sm:px-6 xl:px-2 h-full">
      <div className="bg-white sm:rounded-tl-[20px] rounded-bl-[20px] rounded-br-[20px] p-4 xl:p-8 xl:pb-5 h-full">
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
            <Sidebar
              setId={setId}
              id={id}
              redirectTo={redirectTo}
              setSearchResults={setSearchResults}
              onDropCategory={handleDropToCategory}
            />
          </div>

          <div className="bookmark-content-wrapper h-full">
            {listingType !== "link" ? (
              <div className="flex flex-wrap md:items-center justify-between flex-col md:flex-row">
                <div className="flex flex-wrap items-center gap-2">
                  <AddNewBookmarkField
                    setWhichModalOpen={setWhichModalOpen}
                    setUrlToBookmark={setUrlToBookmark}
                  />
                </div>
                <GoogleSearchbar googleRef={googleRef} listingType={'links'} />                 
              </div>
            ) : (
              <div className="flex flex-wrap md:items-center justify-between flex-col md:flex-row">
                <div className="flex flex-wrap items-center gap-2"></div>
                <div className="w-2/5">
                  <Searchbar
                    linkSearch={true}
                    closeAllModals={closeAllModals}
                    setSearchResults={setSearchResults}
                  />
                </div>
              </div>
            )}

            <div className={`rounded-2xl bg-white md:h-[calc(100%-66px)]`}>
              {/* <div className="gcse-searchresults" data-gname="storesearch"></div> */}
              <p className="flex flex-wrap flex-col md:flex-row md:items-center gap-x-4 text-lg md:text-xl xl:text-[28px] text-dark-blue capitalize mb-5 ps-6">
                {pageHeading}
                {pageHeading === "Top Links" ? (
                  <span className="text-base text-light-black inline-block">
                    Drag thumbnails to desired position, pin to a grid location,
                    or right-click for more options.
                  </span>
                ) : null}
              </p>

              <div className={`rounded-xl border border-light-blue p-6 h-[calc(100%-75px)] ${listingType === "link" && links && links?.length > 0 ? '' : 'overflow-auto custom-scrollbar'}`}>
                {loading?.fetchCategoryWiseBookmarks ? (
                  <span className="loader"></span>
                ) : listingType === "link" && links && links?.length > 0 ? (
                  <div className="flex flex-wrap h-full">
                    <aside className="w-2/5 border-e border-light-blue h-full pe-6 sticky top-0">
                      <ul>
                        {category &&
                          category?.length > 0 &&
                          category?.sort()?.map((cat) => {
                            return (
                              // relative rounded-lg bg-lighter-blue mb-2 py-1.5 px-2.5 flex flex-wrap items-center text-base text-light-black w-full focus:outline-none cursor-pointer
                              <li
                                key={cat}
                                className={`mb-2 text-base cursor-pointer hover:text-black hover:underline ${selectedCat === cat ? 'text-black' : 'text-dark-blue'}`}
                                onClick={() => setSelectedCat(cat)}
                              >
                                <span className="block text-start w-full">
                                  {cat}
                                </span>
                              </li>
                            );
                          })}
                      </ul>
                    </aside>
                    <ul className="list-none ps-6 w-3/5 overflow-auto custom-scrollbar h-full">
                      <li className="font-bold text-lg mb-3">{selectedCat}</li>
                      {Object.entries(getSubCategoryGroups()).map(
                        ([subCat, links]) => (
                          <div key={subCat} className="mb-6">
                            <h3 className="flex flex-wrap flex-col gap-x-4 text-lg text-black font-medium capitalize mb-2">
                              {subCat}
                            </h3>
                            <ul className="">
                              {links.map((link) => {
                                return (
                                  <li
                                  key={link.id}
                                  className="pl-4"
                                  onContextMenu={(e) =>{
                                    linkHandleRightClick(e, link)}
                                  }
                                >
                                  <a
                                    href={link.website_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="mb-2 text-base text-dark-blue cursor-pointer hover:text-black hover:underline"
                                  >
                                    {link.title}
                                  </a>
                                </li>
                                  )
                                }
                              )}
                            </ul>
                          </div>
                        )
                      )}
                    </ul>
                  </div>
                ) : listingType === "bookmark" && bookmarks?.length > 0 ? (
                  <>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 2xl:grid-cols-3 gap-7">
                      {bookmarks && bookmarks?.length > 0 ? (
                        bookmarks?.map((bookmark, index) => (
                          <li
                            key={bookmark?.id}
                            draggable
                            onDragStart={(e) => handleDragStart(e, bookmark?.bookmark_id)}
                            onDragOver={handleDragOver}
                            onDrop={() => handleDrop(bookmark.id)}
                            onContextMenu={(e) => handleRightClick(e, bookmark)}
                            className="relative"
                            style={{
                              opacity: draggedItemId === index ? 0.5 : 1
                            }}
                          >
                            <Bookmark
                              item={bookmark}
                              handleRemoveItem={handleRemoveItem}
                              categoryId={id?.categoryId}
                              subCategoryId={id?.subCategoryId}
                              setId={setId}
                              searchResults={searchResults}
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
                    <img src="./no-data-concept.jpeg" alt="No Data Found!" />
                  </div>
                )}

                {links && links?.length > 0 && contextMenu && listingType === "link" && (
                  <BookmarkGoogleResultContext
                    setContextMenu={setContextMenu}
                    contextMenu={contextMenu}
                    handleOptionClick={linkHandleOptionClick}
                  />
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
