import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
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
  const { links, totalLinks, paginationLinks, searchQuery, loading } =
    useSelector((state) => state.admin);
  const debouncedQuery = useDebounce(searchQuery, 500);

  const [selectedBookmarks, setSelectedBookmarks] = useState([]);

  useEffect(() => {
    dispatch(linkListing({token, isAdmin:true}))
  }, [dispatch, debouncedQuery]);

  useEffect(() => {
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
          dispatch(linkListing({token}));
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
          dispatch(linkListing({token})); 
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
        <div className="bg-white border border-gray-200 overflow-x-auto rounded-xl shadow-2xs overflow-hidden">
          <div className="px-6 py-4 grid gap-3 md:flex md:justify-between md:items-center border-b border-gray-200">
            <div>
              <h2 className="text-xl font-semibold text-gray-800">
                Instant LinX
              </h2>
              <p className="text-sm text-gray-600 ">
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
          {
            loading?.linkListing ?
            <div className="flex flex-wrap justify-center w-full py-10">
                <span className="loader"></span>
              </div>
            :
          links && links?.length > 0 ? (            
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50 ">
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
                          className="me-2 shrink-0 border-gray-300 rounded-sm text-blue-600 focus:ring-blue-500 checked:border-blue-500 disabled:opacity-50 disabled:pointer-events-none "
                          id="hs-at-with-checkboxes-main"
                        />
                        {/* <span className="text-xs font-semibold uppercase text-gray-800 ">
                        ID
                      </span> */}
                      </label>
                    </th>
                    
                    <th scope="col" className="px-6 py-3 text-start">
                      <div className="flex items-center gap-x-2">
                        <span className="text-xs font-semibold uppercase text-gray-800 ">
                          Title
                        </span>
                      </div>
                    </th>

                    <th scope="col" className="px-6 py-3 text-start">
                      <div className="flex items-center gap-x-2">
                        <span className="text-xs font-semibold uppercase text-gray-800 ">
                          Website Url
                        </span>
                      </div>
                    </th>
                   
                    <th scope="col" className="px-6 py-3 text-start">
                      <div className="flex items-center gap-x-2">
                        <span className="text-xs font-semibold uppercase text-gray-800 ">
                          Category
                        </span>
                      </div>
                    </th>
                    <th scope="col" className="px-6 py-3 text-start">
                      <div className="flex items-center gap-x-2">
                        <span className="text-xs font-semibold uppercase text-gray-800 ">
                          Sub Category
                        </span>
                      </div>
                    </th>
                    <th scope="col" className="px-6 py-3 text-start">
                      <div className="flex items-center gap-x-2">
                        <span className="text-xs font-semibold uppercase text-gray-800 ">
                          Created
                        </span>
                      </div>
                    </th>

                    <th scope="col" className="px-6 py-3 text-start">
                      <div className="flex items-center gap-x-2">
                        <span className="text-xs font-semibold uppercase text-gray-800 ">
                          Action
                        </span>
                      </div>
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-200 ">
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
            
          ) : null}
          <div className="px-6 py-4 grid gap-3 md:flex md:justify-between md:items-center border-t border-gray-200 ">
            {
              totalLinks >0 &&
            <div>
              <p className="text-sm text-gray-600 ">
                <span className="font-semibold text-gray-800 ">
                  {totalLinks}
                </span>{" "}
                results
              </p>
            </div>
            }

            {/* Counter Pagination */}
            <div className="inline-flex gap-x-2">
              {paginationLinks &&
                paginationLinks?.length > 3 &&
                paginationLinks.map((pageNumber, index) => {
                  return (
                    <button
                      key={index}
                      type="button"
                      disabled={pageNumber?.url === null}
                      onClick={() => handlePagination(pageNumber?.url)}
                      className={`${
                        pageNumber?.active ? "bg-gray-100" : "bg-white"
                      } py-1.5 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 text-gray-800 shadow-2xs hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none focus:outline-hidden focus:bg-gray-50`}
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
