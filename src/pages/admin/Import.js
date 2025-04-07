import React, { useEffect, useState } from "react";
import Dropzone from "react-dropzone";
import { toast } from "react-toastify";
import {
  importBookmarks,
  clearImportBookmarksMessage
} from "../../redux/slices/bookmarkSlice";
import { useDispatch, useSelector } from "react-redux";
import parse from "html-react-parser";

const Import = () => {
  const dispatch = useDispatch();
  const [htmlContent, setHtmlContent] = useState("");
  const [errors, setError] = useState("");
  const [uploadedFile, setUploadedFile] = useState(null);
  const { token } = useSelector((state) => state.auth);
  const { importError, importBookmarkMessage, loading } = useSelector(
    (state) => state.bookmark
  );

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
        toast.success("Bookmarks imported successfully!");
        setUploadedFile(null);
        setHtmlContent(null);
    } catch (error) {
      toast.error(error?.message || "Something went wrong");
    }
  };

  return (
    <div className="w-full lg:ps-64">
      <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
        <div className="bg-white border border-gray-200 overflow-x-auto rounded-xl shadow-2xs overflow-hidden dark:bg-neutral-800 dark:border-neutral-700">
          <div className="px-6 py-4 grid gap-3 md:flex md:justify-between md:items-center border-b border-gray-200 dark:border-neutral-700">
            <div>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-neutral-200">
                Import Bookmarks
              </h2>
              <p className="text-sm text-gray-600 dark:text-neutral-400">
                Admin can import more bookmarks to search.
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
            <Dropzone
              accept={{
                "text/html": [".html"]
              }}
              onDropRejected={handleRejected}
              onDrop={handleDrop}
            >
              {({ getRootProps, getInputProps }) => (
                <div className="w-full md:w-1/2 flex flex-wrap space-y-4 pb-4 md:pb-0 md:pe-4">
                  <div
                    className="cursor-pointer w-full p-12 flex justify-center bg-white border border-dashed border-gray-300 rounded-xl dark:bg-neutral-800 dark:border-neutral-600 h-full items-center"
                    {...getRootProps()}
                  >
                    <input
                      {...getInputProps()}
                      accept=".html"
                      onChange={handleFileUpload}
                    />
                    <div className="text-center">
                      <span className="inline-flex justify-center items-center size-16 bg-gray-100 text-gray-800 rounded-full dark:bg-neutral-700 dark:text-neutral-200">
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
                        <span className="pe-1 font-medium text-gray-800 dark:text-neutral-200">
                          Drop your file here or
                        </span>
                        <span className="bg-white font-semibold text-blue-600 hover:text-blue-700 rounded-lg decoration-2 hover:underline focus-within:outline-hidden focus-within:ring-2 focus-within:ring-blue-600 focus-within:ring-offset-2 dark:bg-neutral-800 dark:text-blue-500 dark:hover:text-blue-600">
                          browse
                        </span>
                      </div>

                      <p className="mt-1 text-xs text-gray-400 dark:text-neutral-400">
                        Pick a file up to 2MB.
                      </p>
                    </div>
                  </div>
                  {uploadedFile && errors === "" ? (
                    <div className="p-3 bg-white border border-solid border-gray-300 rounded-xl dark:bg-neutral-800 dark:border-neutral-600">
                      <div className="mb-1 flex justify-between items-center">
                        <div className="flex items-center gap-x-3">
                          <span
                            className="size-10 flex justify-center items-center border border-gray-200 text-gray-500 rounded-lg dark:border-neutral-700 dark:text-neutral-500"
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
                            <p className="text-sm font-medium text-gray-800 dark:text-white">
                              <span className="truncate inline-block max-w-75 align-bottom">
                                {uploadedFile?.name}
                              </span>
                            </p>
                            {errors && (
                              <p className="text-xs text-red-500">{errors}</p>
                            )}

                            <p
                              className="text-xs text-gray-500 dark:text-neutral-500"
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
                            className="text-gray-500 hover:text-gray-800 focus:outline-hidden focus:text-gray-800 dark:text-neutral-500 dark:hover:text-neutral-200 dark:focus:text-neutral-200"
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
            <div className="w-full md:w-1/2 md:ps-4 import-bookmarks-list h-full">
              <div className="w-full p-12 pt-8 bg-white border border-dashed border-gray-300 rounded-xl h-full overflow-auto flex flex-wrap items-center h-[500px] max-h-[calc(100vh-240px)] overflow-auto md:h-full">
                {htmlContent ? (
                  parse(htmlContent)
                ) : (
                  <img src="/no-data-concept.jpeg" alt="" />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Import;
