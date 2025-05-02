import moment from "moment/moment";
import React from "react";
import { Link } from "react-router-dom";

const LinksTableData = ({
  bookmark,
  deleteSingleBookmark,
  selectedBookmarks,
  handleSelectOneBookmark
}) => {
  return (
    <tr>
      <td className="size-px whitespace-nowrap">
        <div className="px-6 py-3">
          <label
            htmlFor={`hs-at-with-checkboxes-${bookmark.id}`}
            className="flex"
          >
            <input
              type="checkbox"
              className="me-2 shrink-0 border-gray-300 rounded-sm text-blue-600 focus:ring-blue-500 checked:border-blue-500 disabled:opacity-50 disabled:pointer-events-none"
              id={`hs-at-with-checkboxes-${bookmark?.id}`}
              checked={selectedBookmarks?.includes(bookmark?.id)}
              onChange={() => handleSelectOneBookmark(bookmark?.id)}
            />
          </label>
        </div>
      </td>
     
      <td className="h-px min-w-48 w-48 xl:max-w-72">
        <div className="px-6 py-3 flex flex-wrap flex-col">
          <span
            className="block break-all text-sm text-gray-500 text-truncate"
          >
            {bookmark?.title}
          </span>
        </div>
      </td>

      <td className="h-px min-w-48 w-48 xl:max-w-72">
        <div className="px-6 py-3 flex flex-wrap flex-col">
          <Link
            to={bookmark?.website_url}
            target="_blank"
            rel="noopener noreferrer"
            className="block break-all text-sm text-gray-500  group-hover:text-blue-500 text-truncate"
          >
            {bookmark?.website_url}
          </Link>
        </div>
      </td>
      <td className="size-px whitespace-nowrap">
        <div className="px-6 py-3">
          <span className="text-sm text-gray-500 ">
            {moment(bookmark?.created_at).format("MMMM Do YYYY")}
          </span>
        </div>
      </td>
     
      <td className="size-px whitespace-nowrap">
        <div className="px-6 py-1.5">
          <button
            className="inline-flex items-center gap-x-1 text-sm text-blue-600 decoration-2 hover:underline focus:outline-hidden focus:underline font-medium "
            onClick={() => deleteSingleBookmark([bookmark?.id])}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="size-5"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="size-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                />
              </svg>
            </svg>
          </button>
        </div>
      </td>
    </tr>
  );
};

export default LinksTableData;
