import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  fetchAllBookmarks,
  handleLinksPagination,
  setSearchQuery
} from "../../redux/slices/adminSlice";
import Swal from "sweetalert2";
import useDebounce from "../../hooks/useDebounce";
import { deleteLink, linkListing } from "../../redux/slices/adminSlice";
import LinksTableData from "./LinksTableData";

const Links = () => {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const { links, totalLinks, paginationLinks, searchQuery } =
    useSelector((state) => state.admin);
  const debouncedQuery = useDebounce(searchQuery, 500);

  const [selectedBookmarks, setSelectedBookmarks] = useState([]);

  useEffect(() => {
    dispatch(fetchAllBookmarks(token));
  }, [dispatch, token, debouncedQuery]);

  useEffect(() => {
    dispatch(linkListing({token, title:'', isAdmin:true}))
    return () => {
      dispatch(setSearchQuery(""));
    };
  }, [dispatch]);

  const handlePagination = async (url) => {
    dispatch(handleLinksPagination({ url, token }));
  };

  const handleSelectAllBookmarks = () => {
    if (selectedBookmarks?.length === links?.length) {
      setSelectedBookmarks([]);
    }
    else {
      setSelectedBookmarks(links?.map((bookmark) => bookmark?.id));
    }
  };

  const handleSelectOneBookmark = (bookmark_id) => {
    setSelectedBookmarks(prev=> prev.includes(bookmark_id)
    ? prev.filter((id) => id !== bookmark_id)
    : [...prev, bookmark_id])
  }

  const deleteBookmarkSelected = async (id) => {
    if (!id) {
      toast.warning("No bookmark found!");
      return;
    }
    const confirmDelete = async () => {
      await dispatch(deleteLink({token, ids:selectedBookmarks}))
        .unwrap()
        .then((data) => {
          toast.success(data);
          setSelectedBookmarks([]);
          dispatch(linkListing({token, title:""}));
        })
        .catch((err) => {
          console.error("Error deleting LinX: " + err.message);
        });
      };

      // Show confirmation toast with Yes/No buttons
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d9534f",
        cancelButtonColor: "#5bc0de",
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "No, cancel"
      }).then((result) => {
        if (result.isConfirmed) {
          confirmDelete();
        Swal.fire("Deleted!", "Your item has been deleted.", "success");
      }
    });
  };

  //Delete single user
  const deleteSingleBookmark = (ids) => {
    if (!ids || ids.length === 0) {
      toast.warning("No LinX selected!");
      return;
    }
    const confirmDelete = () => {
      dispatch(deleteLink({token, ids }))
        .unwrap()
        .then(() => {
          toast.success("LinX deleted successfully!");
          dispatch(linkListing({token, title:""})); 
        })
        .catch((err) => {
          toast.error("Error deleting LinX: " + err.message);
        });
    };
  
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d9534f",
      cancelButtonColor: "#5bc0de",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        confirmDelete();
        Swal.fire("Deleted!", "Your item has been deleted.", "success");
      }
    });
  };  

  return (
    <div className="w-full">
      <div className="">
        <div className="bg-white border border-gray-200 overflow-x-auto rounded-xl shadow-2xs overflow-hidden dark:bg-neutral-800 dark:border-neutral-700">
          <div className="px-6 py-4 grid gap-3 md:flex md:justify-between md:items-center border-b border-gray-200 dark:border-neutral-700">
            <div>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-neutral-200">
                Instant LinX
              </h2>
              <p className="text-sm text-gray-600 dark:text-neutral-400">
                List all the Instant LinX.
              </p>
            </div>
            <div>
              <div className="inline-flex gap-x-2">
                <button
                  onClick={deleteBookmarkSelected}
                  className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-2xs hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none focus:outline-hidden focus:bg-gray-50"
                  disabled={selectedBookmarks?.length === 0 ? "disabled" : ""}
                >
                  Delete all ({selectedBookmarks?.length})
                </button>
              </div>
            </div>
          </div>
          {links && links?.length > 0 ? (
            <>
              <table className="min-w-full divide-y divide-gray-200 dark:divide-neutral-700">
                <thead className="bg-gray-50 dark:bg-neutral-800">
                  <tr>
                  <th scope="col" className="px-6 py-3 text-start">
                      <label
                        htmlFor="hs-at-with-checkboxes-main"
                        className="flex"
                      >
                        <input
                          type="checkbox"
                          onChange={handleSelectAllBookmarks}
                          checked={
                            links?.length > 0 &&
                            selectedBookmarks?.length === links?.length
                          }
                          className="me-2 shrink-0 border-gray-300 rounded-sm text-blue-600 focus:ring-blue-500 checked:border-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-600 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800"
                          id="hs-at-with-checkboxes-main"
                        />
                        {/* <span className="text-xs font-semibold uppercase text-gray-800 dark:text-neutral-200">
                        ID
                      </span> */}
                      </label>
                    </th>
                    
                    <th scope="col" className="px-6 py-3 text-start">
                      <div className="flex items-center gap-x-2">
                        <span className="text-xs font-semibold uppercase text-gray-800 dark:text-neutral-200">
                          Title
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
                          Action
                        </span>
                      </div>
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-200 dark:divide-neutral-700">
                  {links &&
                    links?.length > 0 &&
                    links?.map((link, index) => {
                      return (
                        <React.Fragment  key={link?.id || `bookmark-${index}`}>

                        <LinksTableData
                          showEditOrDelete={true}
                          bookmark={link}
                          deleteSingleBookmark={deleteSingleBookmark}
                          selectedBookmarks={selectedBookmarks}
                          handleSelectOneBookmark={handleSelectOneBookmark}
                          />
                          </React.Fragment>
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
                  {totalLinks}
                </span>{" "}
                results
              </p>
            </div>

            {/* Counter Pagination */}
            <div className="inline-flex gap-x-2">
              {paginationLinks &&
                paginationLinks?.length > 0 &&
                paginationLinks.map((pageNumber, index) => {
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
                      {index === 0
                        ? "<"
                        : index === paginationLinks?.length - 1
                        ? ">"
                        : pageNumber?.label}
                    </button>
                  );
                })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Links;
