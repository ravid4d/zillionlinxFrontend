import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Searchbar from "../components/Searchbar";
import GoogleSearchbar from "../components/GoogleSearchbar";
import { toast } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchAllTopLinks,
  fetchCategoryWiseBookmarks,
  removeTopLink
} from "../redux/slices/bookmarkSlice";
import Bookmark from "../components/Bookmark";
import { useFormik } from "formik";
import * as YUP from "yup";

const MyBookmarks = () => {
  const { setUrlToBookmark, setWhichModalOpen } = useOutletContext();

  const dispatch = useDispatch();

  const { token } = useSelector((state) => state.auth);
  const { bookmarks, loading, error, isTopLink } = useSelector((state) => state.bookmark);
  const { categories } = useSelector((state) => state.category);

  const [draggedIndex, setDraggedIndex] = useState(null);
  const [id, setId] = useState({ categoryId: null, subCategoryId: null });
  const [selectedCategory, setSelectedCategory] = useState({});
  const [selectedSubCategory, setSelectedSubCategory] = useState({});

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
    if (token) {
      fetchData();
    }
  }, [dispatch, token]);

  useEffect(() => {
    if (token && id?.categoryId) {
      dispatch(
        fetchCategoryWiseBookmarks({
          token,
          categoryId: id?.categoryId,
          subCategoryId: id?.subCategoryId
        })
      );
      setSelectedCategory(
        categories?.find((category) => category?.id === id?.categoryId)
      );
      setSelectedSubCategory(
        selectedCategory?.subcategories?.find(
          (subCategory) => subCategory?.id === id?.subCategoryId
        )
      );
    }
  }, [id?.categoryId, id?.subCategoryId, token, dispatch]);

  const formik = useFormik({
    initialValues: {
      url: ""
    },
    validationSchema: YUP.object({
      url: YUP.string().url("Invalid URL format").required("URL is required.")
    }),
    onSubmit: (values) => {
      setUrlToBookmark(values);
      addBookmarkViaUrl();
    }
  });

  // When drag starts, store the item's index
  const handleDragStart = (index) => {
    setDraggedIndex(index);
  };

  // When dragged over another item, reorder the list
  const handleDragOver = (index) => {
    if (draggedIndex === null || draggedIndex === index) return;

    const newBookmarks = [...bookmarks];
    const draggedItem = newBookmarks.splice(draggedIndex, 1)[0]; // Remove dragged item
    newBookmarks.splice(index, 0, draggedItem); // Insert at new position

    setDraggedIndex(index); // Update dragged index
    // setTopLinks(newTopLinks);
  };

  // Reset dragged item index on drag end
  const handleDragEnd = () => {
    setDraggedIndex(null);
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

  //Open Add New Bookmark Modal
  const addBookmarkViaUrl = () => {
    setWhichModalOpen("newBookmark");
    let inputField = document.getElementById("url");
    inputField.blur();
    setTimeout(() => {
      formik.resetForm();
    }, 500);
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
              <form onSubmit={formik.handleSubmit}>
                <div className="flex items-center rounded-xl shadow-sm mb-4 relative add-url-to-bookmark w-[350px]">
                  <input
                    type="text"
                    value={formik.values.url}
                    onChange={formik.handleChange}
                    placeholder="Add an URL to Your Bookmarks"
                    id="url"
                    name="url"
                    className="h-[48px] py-3 pl-4 pr-14 block w-full border-gray-200 rounded-xl text-sm placeholder:text-lg placeholder:text-light-black/48 focus:z-10 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
                  />
                  {formik.touched.url && formik.errors.url ? (
                    <div className="text-red-500 text-sm absolute -top-[20px] left-2">
                      {formik.errors.url}
                    </div>
                  ) : null}
                  <button
                    type="submit"
                    className="absolute z-20 right-2 top-1 w-[40px] h-[40px] inline-flex justify-center items-center border border-transparent bg-transparent hover:bg-transparent focus:outline-none focus:bg-transparent disabled:opacity-50 disabled:pointer-events-none"
                  >
                    <img src="/submit-icon.png" alt="" className="" />
                  </button>
                </div>
              </form>
              <GoogleSearchbar />
            </div>
            <div className="rounded-2xl bg-white p-6 h-[calc(100%-64px)]">
              <p className="text-[28px] text-dark-blue capitalize mb-5 pt-6">
                  {
                    isTopLink ? 'Top Links' : 
                    id?.categoryId ? `${selectedCategory?.title} ${selectedSubCategory?.title ? `| ${selectedSubCategory?.title}` : ""}` : ""
                  }
                {!id?.categoryId ? (
                  <span className="text-base text-light-black inline-block ml-4">
                    (Drag and drop thumbnails to position top links or pin to a
                    grid location)
                  </span>
                ) : null}
              </p>
              <div className="rounded-xl border border-light-blue p-6 overflow-auto custom-scrollbar h-[calc(100vh-66px)]">
                {loading ? (
                  <span className="loader"></span>
                ) : bookmarks?.length === 0 && error ? (
                  <h2 className="text-[22px] text-red-500 mb-5">{error}</h2>
                ) : (
                  <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 2xl:grid-cols-3 gap-7">
                    {bookmarks?.bookmarks &&
                    bookmarks?.bookmarks?.length > 0 ? (
                      bookmarks?.bookmarks?.map((bookmark, index) => (
                        <li
                          key={bookmark?.id}
                          draggable
                          onDragStart={() => handleDragStart(bookmark?.id)}
                          onDragOver={() => handleDragOver(bookmark?.id)}
                          onDragEnd={handleDragEnd}
                          className="relative"
                          style={{ opacity: draggedIndex === index ? 0.5 : 1 }}
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
