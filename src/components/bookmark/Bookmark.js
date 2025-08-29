import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  disabledTopLinks,
  fetchAllTopLinks,
  fetchCategoryWiseBookmarks,
  pinBookmark
} from "../../redux/slices/bookmarkSlice";
import { toast } from "react-toastify";

const Bookmark = ({
  item,
  handleRemoveItem,
  categoryId,
  subCategoryId,
  searchResults,
  setId
}) => {
  const { token } = useSelector((state) => state.auth);

  const dispatch = useDispatch();

  const addToPin = async (bookmarkId) => {
    const result = await dispatch(pinBookmark({ bookmarkId, token }));
    if (pinBookmark.fulfilled.match(result)) {
      toast.success(result.payload || "Bookmark pinned successfully!");
    } else {
      toast.error(result.payload || "Failed to pin bookmark.");
    }
    if (categoryId !== null && subCategoryId !== null) {
      dispatch(disabledTopLinks());
      await dispatch(
        fetchCategoryWiseBookmarks({ token, categoryId, subCategoryId })
      );
    } else {
      await dispatch(fetchAllTopLinks(token));
    }
  };
  const doNotClick = [
    `${process.env.REACT_APP_API_URL}/bookmark-tips3.html`,
    `${process.env.REACT_APP_API_URL}/Instant-LinX-Help3.html`
  ];

  return (
    <>
      <span
        className={`bg-whtie relative overflow-hidden rounded-xl block shadow-bookmark border border-dark-blue/30`}
      >
        <span
          className={`${
            searchResults ? "hidden" : ""
          } pin-icon w-6 h-6 rounded-full z-30 ${
            item?.pinned ? "bg-dark-blue" : "bg-light-blue"
          } flex flex-wrap items-center justify-center cursor-pointer absolute left-2 top-2`}
        >
          <label
            htmlFor={`pinBookmark_${item?.id}`}
            className="flex h-full w-full cursor-pointer rounded-lg text-sm flex flex-wrap items-center justify-center"
          >
            <input
              type="checkbox"
              className="hidden shrink-0 mt-0.5 border-gray-200 rounded text-blue-600 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none "
              id={`pinBookmark_${item?.id}`}
              checked={item?.pinned ? "checked" : ""}
              onChange={() => addToPin(item?.id)}
            />
            <svg
              width="11"
              height="10"
              viewBox="0 0 11 10"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="cursor-pointer"
            >
              <path
                d="M10.0377 3.96597L6.73769 0.665967C6.58769 0.515967 6.36269 0.515967 6.21269 0.665967L5.01269 1.86597C4.82519 2.05347 4.90019 2.27847 5.01269 2.39097L5.27519 2.65347L4.15019 3.77847C3.58769 3.66597 2.0502 3.40347 1.2252 4.22847C1.0752 4.37847 1.0752 4.60347 1.2252 4.75347L3.36269 6.89097L1.0002 9.25347C0.850195 9.40347 0.850195 9.62847 1.0002 9.77847C1.1502 9.92847 1.4127 9.89097 1.5252 9.77847L3.88769 7.41597L6.02519 9.55347C6.25019 9.74097 6.47519 9.66597 6.55019 9.55347C7.37519 8.72847 7.11269 7.19097 7.00019 6.62847L8.12519 5.50347L8.38769 5.76597C8.53769 5.91597 8.76269 5.91597 8.91269 5.76597L10.1127 4.56597C10.1877 4.34097 10.1877 4.11597 10.0377 3.96597Z"
                fill={item?.pinned ? "#c0c6ff" : "#2131E5"}
              />
            </svg>
          </label>
        </span>
        {doNotClick?.includes(item?.website_url) ? (
          <div className="relative w-full block">
            <div className="w-full aspect-[16/9] overflow-hidden object-cover object-top">
              <img
                src={`${process.env.REACT_APP_API_URL}/storage/${item?.icon_path}`}
                alt=""
                className="w-full rounded-lg"
              />
            </div>
          </div>
        ) : (
          <Link
            target="_blank"
            to={item?.website_url}
            className="relative w-full block"
          >
            <div className="w-full aspect-[16/9] overflow-hidden object-cover object-top">
              <img
                src={`${process.env.REACT_APP_API_URL}/storage/${item?.icon_path}`}
                alt=""
                className="w-full rounded-lg"
              />
            </div>
          </Link>
        )}
        {doNotClick?.includes(item?.website_url) ? (
          <div className="relative w-full block">
            <span className="block bg-white text-center text-[16px] py-2 px-4 whitespace-nowrap text-ellipsis overflow-hidden font-semibold">
              {item?.title}
            </span>
          </div>
        ) : (
          <Link target="_blank" to={item?.website_url}>
            <span className="block bg-white text-center text-[16px] py-2 px-4 whitespace-nowrap text-ellipsis overflow-hidden font-semibold">
              {item?.title}
            </span>
          </Link>
        )}
      </span>
    </>
  );
};

export default Bookmark;
