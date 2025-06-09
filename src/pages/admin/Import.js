import React, { useEffect, useState } from "react";
import Dropzone from "react-dropzone";
import { toast } from "react-toastify";
import {
  importBookmarks,
  clearImportBookmarksMessage
} from "../../redux/slices/bookmarkSlice";
import { useDispatch, useSelector } from "react-redux";
import parse from "html-react-parser";
import Links from "../../components/admin/Links";
import { getInstantCategories, linkListing, setFilterLinks } from '../../redux/slices/adminSlice';

const Import = () => {
  const dispatch = useDispatch();
  const [htmlContent, setHtmlContent] = useState("");
  const [errors, setError] = useState("");
  const [uploadedFile, setUploadedFile] = useState(null);
  const { token } = useSelector((state) => state.auth);
  const { importError, importBookmarkMessage } = useSelector(
    (state) => state.bookmark
  );
  const [openAccordion, setOpenAccordion] = useState({});

  const { instantCategories } = useSelector((state) => state.admin);
  // console.log(instantCategories, 'instantCategories')

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setUploadedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setHtmlContent(e.target.result);
      };
      reader.readAsText(file);
    }
  };

  useEffect(() => {
    if (htmlContent) {
      const links = document.querySelectorAll(".import-bookmarks-list a");

      // Left-Click Event Handler (Open in New Tab)
      const handleLeftClick = (event) => {
        event.preventDefault();
        window.open(event.target.href, "_blank", "noopener,noreferrer");
      };

      // Attach events to all anchor tags
      links.forEach((link) => {
        // link.addEventListener("contextmenu", handleRightClick);
        link.addEventListener("click", handleLeftClick);
      });

      // Cleanup event listeners
      return () => {
        links.forEach((link) => {
          //   link.removeEventListener("contextmenu", handleRightClick);
          link.removeEventListener("click", handleLeftClick);
        });
      };
    }
  }, [htmlContent]);

  const handleDrop = (acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      setUploadedFile(file);
      setError("");
    }
  };

  const handleRejected = (fileRejections) => {
    if (fileRejections.length > 0) {
      const rejected = fileRejections[0].file;
      setError(
        `Only .html files are allowed. You uploaded: ${rejected.name} (${(
          rejected.size / 1024
        ).toFixed(2)} KB)`
      );
      setUploadedFile(null);
    }
  };

  useEffect(() => {
    if (importError !== null) {
      setError(importError);
      toast.error(importError);
      setTimeout(() => {
        dispatch(clearImportBookmarksMessage());
        setError("");
        setUploadedFile(null);
      }, 1000);
    }
  }, [importError, dispatch]);

  useEffect(() => {
    if (importBookmarkMessage !== "") {
      toast.success(importBookmarkMessage);
      setUploadedFile(null);
    }
  }, [importBookmarkMessage]);

  const importBookmark = async () => {
    let formData = new FormData();
    formData.append("file", uploadedFile);
    try {
      await dispatch(importBookmarks({ token, formData }));
      setUploadedFile(null);
      setHtmlContent(null);
    } catch (error) {
      toast.error(error?.message || "Something went wrong");
    }
  };

  useEffect(() => {
    dispatch(getInstantCategories());
  }, [dispatch])

  const toggleAccordion = (id, hasDropdown) => {
    if (!hasDropdown) return;
    setOpenAccordion((prevId) => (prevId === id ? null : id));
  };

  const callInstantCategories = async (category, sub_category) => {
    try {
      dispatch(setFilterLinks({ category_id: category, sub_category_id: sub_category ? sub_category : "" }));
      await dispatch(linkListing());
    } catch (error) {
      console.error(error);
    }
  }


  return (
    <div className="w-full lg:ps-64">
      <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
        <div className="bg-white border border-gray-200 overflow-x-auto rounded-xl shadow-2xs overflow-hidden ">
          <div className="px-6 py-4 grid gap-3 md:flex md:justify-between md:items-center border-b border-gray-200">
            <div>
              <h2 className="text-xl font-semibold text-gray-800 ">
                Import Instant LinX
              </h2>
              <p className="text-sm text-gray-600 ">
                Admin can import more links to search.
              </p>
            </div>
            <div>
              <button
                disabled={!uploadedFile}
                className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-2xs hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none focus:outline-hidden focus:bg-gray-50"
                onClick={importBookmark}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="size-4 shrink-0"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"
                  />
                </svg>
                Import
              </button>
            </div>
          </div>
          <div className="flex flex-wrap md:h-full w-full flex-col md:flex-row p-6">

            <div className="flex flex-wrap lg:h-full lg:flex-col w-full lg:pe-4 import-bookmarks-list" style={{ "width": "20%" }}>
              <Dropzone
                accept={{
                  "text/html": [".html"]
                }}
                onDropRejected={handleRejected}
                onDrop={handleDrop}
              >
                {({ getRootProps, getInputProps }) => (
                  <div className="w-full flex flex-wrap space-y-4 pb-4">
                    <div
                      className="cursor-pointer w-full p-12 flex justify-center bg-white border border-dashed border-gray-300 rounded-xl lg:h-full items-center"
                      {...getRootProps()}
                    >
                      <input
                        {...getInputProps()}
                        accept=".html"
                        onChange={handleFileUpload}
                      />
                      <div className="text-center">
                        <span className="inline-flex justify-center items-center size-16 bg-gray-100 text-gray-800 rounded-full ">
                          <svg
                            className="shrink-0 size-6"
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
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                            <polyline points="17 8 12 3 7 8"></polyline>
                            <line x1="12" x2="12" y1="3" y2="15"></line>
                          </svg>
                        </span>

                        <div className="mt-4 flex flex-wrap justify-center text-sm/6 text-gray-600">
                          <span className="pe-1 font-medium text-gray-800 ">
                            Drop your file here or
                          </span>
                          <span className="bg-white font-semibold text-blue-600 hover:text-blue-700 rounded-lg decoration-2 hover:underline focus-within:outline-hidden focus-within:ring-2 focus-within:ring-blue-600 focus-within:ring-offset-2 ">
                            browse
                          </span>
                        </div>

                        <p className="mt-1 text-xs text-gray-400 ">
                          Pick a file up to 2MB.
                        </p>
                      </div>
                    </div>
                    {uploadedFile && errors === "" ? (
                      <div className="w-full p-3 bg-white border border-solid border-gray-300 rounded-xl ">
                        <div className="mb-1 flex justify-between items-center">
                          <div className="flex items-center gap-x-3">
                            <span
                              className="size-10 flex justify-center items-center border border-gray-200 text-gray-500 rounded-lg "
                              data-hs-file-upload-file-icon=""
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="shrink-0 size-5"
                              >
                                <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"></path>
                                <path d="M14 2v4a2 2 0 0 0 2 2h4"></path>
                              </svg>
                            </span>
                            <div>
                              <p className="text-sm font-medium text-gray-800 ">
                                <span className="truncate inline-block max-w-75 align-bottom">
                                  {uploadedFile?.name}
                                </span>
                              </p>
                              {errors && (
                                <p className="text-xs text-red-500">{errors}</p>
                              )}

                              <p
                                className="text-xs text-gray-500"
                                data-hs-file-upload-file-size=""
                              >
                                {!isNaN(uploadedFile?.size)
                                  ? `${parseFloat(
                                    (uploadedFile?.size / 1024).toFixed(2)
                                  )}KB`
                                  : ""}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-x-2">
                            <button
                              type="button"
                              className="text-gray-500 hover:text-gray-800 focus:outline-hidden focus:text-gray-800 "
                              data-hs-file-upload-remove=""
                              onClick={() => setUploadedFile(null)}
                            >
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
                                <path d="M3 6h18"></path>
                                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                                <line x1="10" x2="10" y1="11" y2="17"></line>
                                <line x1="14" x2="14" y1="11" y2="17"></line>
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : null}
                  </div>
                )}
              </Dropzone>
              <div className="w-full import-bookmarks-list h-full">
                <div className="w-full p-6 lg:p-12 pt-2 lg:pt-8 bg-white border border-dashed border-gray-300 rounded-xl h-full overflow-auto flex flex-wrap items-center h-[500px] max-h-[calc(100vh-240px)] overflow-auto md:h-full">
                  {htmlContent ? (
                    parse(htmlContent)
                  ) : (
                    <img src="/no-data-concept.jpeg" alt="" />
                  )}
                </div>
              </div>
            </div>
            <div className="flex flex-wrap lg:h-full lg:flex-col w-full lg:ps-4 lg:pe-4 import-bookmarks-list" style={{ "width": "20%" }}>
              <ul className="rounded-xl border border-light-blue p-4 min-h-4/6 h-[calc(100%-62px)] xl:h-[calc(100%-60px)] bookmark-sidebar custom-scrollbar overflow-x-hidden overflow-y-auto">
                {
                  instantCategories?.length > 0 && instantCategories.map((category, index) => {
                    let cats = category?.category?.replaceAll(" ", "").toLowerCase();
                    const hasDropdown = category?.sub_categories?.length > 0;
                    const isActive = openAccordion === `users-accordion_${cats}`;
                    return (
                      <li
                        key={index}
                        className={`
                  ${isActive ? "active" : ""
                          } hs-accordion-group hs-accordion last:mb-0 relative
                  `}>
                        <button
                          onClick={() => {
                            callInstantCategories(category?.category, "");
                            toggleAccordion(
                              `users-accordion_${cats}`,
                              hasDropdown
                            );
                          }}
                          type="button"
                          className={`bg-lighter-blue text-light-black group relative rounded-lg mb-2 py-1.5 px-2.5 flex flex-wrap items-center text-sm w-full focus:outline-none ${isActive ? "" : ""
                            }`}
                          aria-expanded={isActive}
                          aria-controls={`users-accordion-collapse-${category?.id}`}
                        >
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="group absolute hs-accordion-toggle">
                            <path d="M8.00037 14.9584C11.8434 14.9584 14.9587 11.843 14.9587 8C14.9587 4.157 11.8434 1.04163 8.00037 1.04163C4.15736 1.04163 1.04199 4.157 1.04199 8C1.04199 11.843 4.15736 14.9584 8.00037 14.9584Z" stroke="#2131E5" strokeWidth="2" strokeMiterlimit="10" strokeLinecap="round" className="circle"></path>
                            <path d="M8 4.1875V11.8125" stroke="#2131E5" strokeWidth="2" strokeMiterlimit="10" strokeLinecap="round" className="plus"></path>
                            <path d="M4.1875 8H11.8125" stroke="#2131E5" strokeWidth="2" strokeMiterlimit="10" strokeLinecap="round" className="minus"></path>
                          </svg>
                          <span className="block pl-6 text-start w-full">{category?.category}</span>
                        </button>
                        {hasDropdown && (
                          <div
                            id={`users-accordion-collapse-${cats}`}
                            className={`hs-accordion-content w-full overflow-hidden transition-[height] duration-300 ${isActive ? "block" : "hidden"
                              }`}
                            role="region"
                            aria-labelledby={`users-accordion_${cats}`}
                          >
                            <ul className="pt-1 ps-3 space-y-1">
                              {category?.sub_categories?.map((subCat, subIndex) => {
                                return (
                                  <li
                                    className="hs-accordion-group hs-accordion relative"
                                    id={`users-accordion-sub-${subIndex}`}
                                    key={subIndex}
                                  >
                                    <button
                                      onClick={() => {
                                        callInstantCategories(category?.category, subCat);
                                      }}
                                      type="button"
                                      className={`bg-lighter-blue text-light-black
                                  group rounded-lg mb-2 py-1.5 px-2.5 flex flex-wrap items-center space-x-2 text-sm w-full focus:outline-none`}
                                      aria-expanded="true"
                                      aria-controls="users-accordion-sub-1-collapse-1"
                                    >
                                      <svg
                                        width="16"
                                        height="16"
                                        viewBox="0 0 16 16"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                        className={`hs-accordion-toggle`}
                                      >
                                        <path
                                          d="M8.00037 14.9584C11.8434 14.9584 14.9587 11.843 14.9587 8C14.9587 4.157 11.8434 1.04163 8.00037 1.04163C4.15736 1.04163 1.04199 4.157 1.04199 8C1.04199 11.843 4.15736 14.9584 8.00037 14.9584Z"
                                          stroke="#2131E5"
                                          strokeWidth="2"
                                          strokeMiterlimit="10"
                                          strokeLinecap="round"
                                          className="circle"
                                        />
                                        <path
                                          d="M8 4.1875V11.8125"
                                          stroke="#2131E5"
                                          strokeWidth="2"
                                          strokeMiterlimit="10"
                                          strokeLinecap="round"
                                        />
                                        <path
                                          d="M4.1875 8H11.8125"
                                          stroke="#2131E5"
                                          strokeWidth="2"
                                          strokeMiterlimit="10"
                                          strokeLinecap="round"
                                        />
                                      </svg>
                                      <span>{subCat}</span>
                                    </button>
                                  </li>
                                );
                              })}
                            </ul>
                          </div>
                        )
                        }
                      </li>
                    )
                  })
                }
              </ul>
            </div>
            <div className="w-full lg:ps-4 import-bookmarks-list h-full mt-6 lg:mt-0" style={{ "width": "60%" }}>
              <Links />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Import;
