import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { fetchAllBookmarks, handleBookmarksPagination } from "../../redux/slices/adminSlice";
import BookmarkTableData from "./BookmarkTableData";

const AdminBookmarks = () => {
    const dispatch = useDispatch();
    const { token } = useSelector((state) => state.auth);
    const { adminBookmarks, totalBookmarks, pagination } = useSelector((state) => state.admin);
    useEffect(() => {
      dispatch(fetchAllBookmarks(token));
    }, [dispatch, token]);
  
    const handlePagination = async (url) => {
      dispatch(handleBookmarksPagination({ url, token }));
    };
  
  return (
    <div className="w-full lg:ps-64">
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      <div className="bg-white border border-gray-200 rounded-xl shadow-2xs overflow-hidden dark:bg-neutral-800 dark:border-neutral-700">
        <div className="px-6 py-4 grid gap-3 md:flex md:justify-between md:items-center border-b border-gray-200 dark:border-neutral-700">
          <div>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-neutral-200">
              Bookmarks
            </h2>
            <p className="text-sm text-gray-600 dark:text-neutral-400">
              List all the bookmarks.
            </p>
          </div>
          <div>
            {/* <div className="inline-flex gap-x-2">
              <button
                onClick={handleDeleteSelected}
                className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-2xs hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none focus:outline-hidden focus:bg-gray-50"
                disabled={selectedUsers.length === 0 ? "disabled" : ""}
              >
                Delete all ({selectedUsers.length})
              </button>
            </div> */}
          </div>
        </div>
        {/* {!userLoading && (
          <div className="animate-spin inline-block size-6 border-3 border-red-400 border-t-transparent text-gray-800 rounded-full" role="status" aria-label="loading">
          <span className="sr-only">Loading...</span>
        </div>
        )} */}
        {adminBookmarks && adminBookmarks?.length > 0 ? (
          <>
            <table className="min-w-full divide-y divide-gray-200 dark:divide-neutral-700">
              <thead className="bg-gray-50 dark:bg-neutral-800">
                <tr>
                  {/* <th scope="col" className="px-6 py-3 text-start">
                    <label
                      htmlFor="hs-at-with-checkboxes-main"
                      className="flex"
                    >
                      <input
                        type="checkbox"
                        onChange={handleSelectAllUsers}
                        checked={
                          selectedUsers.length === users.length &&
                          users.length > 0
                        }
                        className="me-2 shrink-0 border-gray-300 rounded-sm text-blue-600 focus:ring-blue-500 checked:border-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-600 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800"
                        id="hs-at-with-checkboxes-main"
                      /> 
                      <span className="text-xs font-semibold uppercase text-gray-800 dark:text-neutral-200">
                        ID
                      </span>
                    </label>
                  </th> */}

                  <th
                    scope="col"
                    className="px-6 py-3 text-start"
                  >
                    <div className="flex items-center gap-x-2">
                      <span className="text-xs font-semibold uppercase text-gray-800 dark:text-neutral-200">
                        Category
                      </span>
                    </div>
                  </th>

                  <th scope="col" className="px-6 py-3 text-start">
                    <div className="flex items-center gap-x-2">
                      <span className="text-xs font-semibold uppercase text-gray-800 dark:text-neutral-200">
                        Sub Category
                      </span>
                    </div>
                  </th>

                  <th scope="col" className="px-6 py-3 text-start">
                    <div className="flex items-center gap-x-2">
                      <span className="text-xs font-semibold uppercase text-gray-800 dark:text-neutral-200">
                        User Name
                      </span>
                    </div>
                  </th>

                  <th scope="col" className="px-6 py-3 text-start">
                    <div className="flex items-center gap-x-2">
                      <span className="text-xs font-semibold uppercase text-gray-800 dark:text-neutral-200">
                        Website Url
                      </span>
                    </div>
                  </th>
                  
                  <th scope="col" className="px-6 py-3 text-start">
                    <div className="flex items-center gap-x-2">
                      <span className="text-xs font-semibold uppercase text-gray-800 dark:text-neutral-200">
                        Created
                      </span>
                    </div>
                  </th>

                  <th scope="col" className="px-6 py-3 text-start">
                    <div className="flex items-center gap-x-2">
                      <span className="text-xs font-semibold uppercase text-gray-800 dark:text-neutral-200">
                        Added To
                      </span>
                    </div>
                  </th>


                  <th scope="col" className="px-6 py-3 text-end"></th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200 dark:divide-neutral-700">
                {adminBookmarks && adminBookmarks?.length>0 && adminBookmarks?.map((bookmark) => {
                  return (
                    <BookmarkTableData
                      bookmark={bookmark}
                      key={bookmark?.id}
                    />
                  );
                })}
              </tbody>
            </table>
          </>
        ) : null}
        <div className="px-6 py-4 grid gap-3 md:flex md:justify-between md:items-center border-t border-gray-200 dark:border-neutral-700">
          <div>
            <p className="text-sm text-gray-600 dark:text-neutral-400">
              <span className="font-semibold text-gray-800 dark:text-neutral-200">
                {totalBookmarks}
              </span>{" "}
              results
            </p>
          </div>

          {/* Counter Pagination */}
          <div className="inline-flex gap-x-2">
            {pagination && pagination?.length>0&&pagination.map((pageNumber, index) => {
              return (
                <button
                  key={index}
                  type="button"
                  disabled={pageNumber?.url === null}
                  onClick={() => handlePagination(pageNumber?.url)}
                  className={`${
                    pageNumber?.active ? "bg-gray-100" : "bg-white"
                  } py-1.5 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 text-gray-800 shadow-2xs hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none focus:outline-hidden focus:bg-gray-50 dark:bg-transparent dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:focus:bg-neutral-800`}
                >
                  {
                    index===0 ? '<' : index === pagination?.length-1 ? '>' : pageNumber?.label
                  }
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  </div>
  )
}

export default AdminBookmarks
