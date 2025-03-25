import React, { useEffect, useState } from "react";
import GoogleSearchbar from "../components/GoogleSearchbar";
import {
  Link,
  Navigate,
  useLocation,
  useNavigate,
  useOutletContext
} from "react-router-dom";
import AddNewBookmarkField from "../components/AddNewBookmarkField";
import { useDispatch, useSelector } from "react-redux";
import { googleSearch } from "../redux/slices/bookmarkSlice";
import BookmarkGoogleResultContext from "../components/BookmarkGoogleResultContext";

const GoogleCustomSearch = () => {
  const navigate = useNavigate();
  const { setUrlToBookmark, setWhichModalOpen } = useOutletContext();
  const { token } = useSelector((state) => state.auth);
  const [noContent, setNoContent] = useState(false);
  const [mainContent, setMainContent] = useState([]);
  const [contextMenu, setContextMenu] = useState(null); 
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const {
    googleResults,
    wikkiResults,
    ebayResults,
    youtubeResults,
    amazonResults,
    bookmarks,
    googleLoading,
    youtubeStaticLink,
    wikiStaticLink,
    ebayStaticLink,
    amazonStaticLink
  } = useSelector((state) => state.bookmark);
  const dispatch = useDispatch();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const query = searchParams.get("query");
  useEffect(() => {
    if (!query) {
      setNoContent(true);
      return;
    }

    let formData = new FormData();
    formData.append("title", query);

    dispatch(googleSearch({ token, formData })).then((result) => {
      if (!result.payload || result.payload?.length === 0) {
        setNoContent(true);
      } else {
        setNoContent(false);
      }
    });
  }, [query, dispatch, token]);

  useEffect(() => {
    if (googleResults?.length > 0) {
      setMainContent(googleResults);
    }
  }, [googleResults]);

  //   const handleResult = (whichResult) => {
  //     whichResult === "youtube"
  //       ? setMainContent(youtubeResults)
  //       : whichResult === "google"
  //       ? setMainContent(googleResults)
  //       : whichResult === "ebay"
  //       ? setMainContent(ebayResults)
  //       : whichResult === "wikki"
  //       ? setMainContent(wikkiResults)
  //       : setNoContent([]);
  //   };

const handleRightClick = (event, record) => {
        event.preventDefault(); // Prevent default browser context menu
        setContextMenu({
            x: event.clientX,
            y: event.clientY,
            record: record, // Save clicked record
        });
    };

    const handleOptionClick = (option) => {
      contextMenu.record = { ...contextMenu.record, type:option };
      setUrlToBookmark(contextMenu)
      // setSelectedRecord({ ...contextMenu.record, type: option }); // Save record with type
      setWhichModalOpen("newBookmark"); // Show second modal
      setContextMenu(null); // Close context menu
  };

  const closeModals = () => {
    setContextMenu(null);
    setWhichModalOpen("newBookmark");
};

  return (
    <div className="max-w-screen-3xl mx-auto px-4 sm:px-6 xl:px-2">
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
          <div className="bookmark-content-wrappers w-full">
            <div className="flex flex-wrap items-center justify-between">
              <div className="bg-white rounded-xl p-3 mb-4">
                Hint: Right Click on any URL / Title below to Bookmark that Link
              </div>
              {/* <AddNewBookmarkField
                setWhichModalOpen={setWhichModalOpen}
                setUrlToBookmark={setUrlToBookmark}
              /> */}
              <GoogleSearchbar />
            </div>
            <div className="rounded-2xl py-6 h-[calc(100%-64px)] flex flex-wrap">
              {noContent ? (
                <div className="text-center w-full p-6 bg-white rounded-xl">
                  <h1 className="text-2xl font-bold">No Content Found</h1>
                  <p>Try searching for something else.</p>
                </div>
              ) : (
                <>
                  <div className="bg-white w-3/4 rounded-xl border border-light-blue p-6 flex flex-wrap ">
                    <div className="w-3/4">
                      <div className="flex flex-wrap items-center space-x-5 mb-2">
                        <img src="/google.svg" alt="" width="160" />
                        <p>Google Custom Search</p>
                      </div>
                      <div className="w-full rounded-xl border border-light-blue p-6 overflow-auto custom-scrollbar h-screen">
                        {googleLoading ? (
                          <span className="loader"></span>
                        ) : (
                          mainContent &&
                          mainContent?.length > 0 &&
                          mainContent?.map((result, index) => {
                            return (
                              <React.Fragment key={index}>
                                <Link
                                  // key={index}
                                  to={result?.link}
                                  className={`block mb-4 last:mb-0 google_result google_result_${index}`}
                                  target="_blank"
                                  onContextMenu={(e) => handleRightClick(e, result)}
                                >
                                  {result?.thumbnail ? (
                                    <img
                                      src={result?.thumbnail}
                                      alt={result?.title}
                                    />
                                  ) : null}
                                  <div className="text-dark-blue text-xl font-medium text-ellipsis overflow-hidden text-nowrap">
                                    {result?.title}
                                  </div>
                                  <p className="text-base text-light-black">
                                    {result?.snippet}
                                  </p>
                                </Link>
                              </React.Fragment>
                            );
                          })
                        )}
                        {contextMenu && 
                          <BookmarkGoogleResultContext contextMenu={contextMenu} handleOptionClick={handleOptionClick} />
                        }
                      </div>
                    </div>
                    <div className={`w-1/4 rounded-2xl ps-6`}>
                      <div className="bg-white">
                        <img
                          src="/member-rank.svg"
                          alt=""
                          width="160"
                          className="mx-auto block mb-2"
                        />
                        <div className="bg-white rounded-xl border border-light-blue p-4 overflow-auto custom-scrollbar overflow-auto custom-scrollbar h-screen">
                          <ul className="grid grid-cols-1 gap-4">
                            {googleLoading ? (
                              <span className="loader"></span>
                            ) : (
                              bookmarks &&
                              bookmarks?.length > 0 &&
                              bookmarks?.map((result, index) => {
                                return (
                                  <li key={index} className="relative">
                                    {/* {result.icon_path} */}
                                    <span className="bg-whtie relative overflow-hidden rounded-xl block border border-dark-blue/30">
                                      <Link
                                        className="min-h-[85px] block"
                                        to={result?.website_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                      >
                                        <img
                                          alt=""
                                          className="w-full"
                                          src={`${process.env.REACT_APP_API_URL}/storage/${result.icon_path}`}
                                        />
                                      </Link>
                                      <Link
                                        to={result?.website_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                      >
                                        <span className="block g-white text-center underline text-xl py-2 px-4 whitespace-nowrap text-ellipsis overflow-hidden">
                                          {result?.title}
                                        </span>
                                      </Link>
                                    </span>
                                  </li>
                                );
                              })
                            )}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className={`w-1/4 rounded-2xl ps-6`}>
                    <div className="bg-white rounded-xl p-6 h-full">
                      <div className="bg-white rounded-xl border border-light-blue h-full p-4">
                        <p className="text-[28px] text-dark-blue capitalize mb-5">
                          Popular Links
                        </p>
                        <div className="overflow-auto custom-scrollbar h-[calc(100%-62px)]">
                          {googleLoading ? (
                            <span className="loader"></span>
                          ) : (
                            <>
                              {/* {googleResults && googleResults?.length > 0 && (
                                <button
                                  className="block mb-2 last:mb-0 w-full"
                                  onClick={() => handleResult("google")}
                                >
                                  <figure className="border border-[#EFF0FF] rounded-md py-3 w-full">
                                    <img
                                      src="/google.svg"
                                      alt=""
                                      width="187"
                                      className="mx-auto max-w-full"
                                    />
                                  </figure>
                                </button>
                              )} */}
                              {wikiStaticLink !== "" && (
                                <Link
                                  className="block mb-2 last:mb-0 w-full"
                                  to={wikiStaticLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  //   onClick={() => handleResult("wikki")}
                                >
                                  <figure className="border border-[#EFF0FF] rounded-md py-3 w-full">
                                    <img
                                      src="/wikki.svg"
                                      alt=""
                                      width="187"
                                      className="mx-auto max-w-full"
                                    />
                                  </figure>
                                </Link>
                              )}
                              {ebayStaticLink !== "" && (
                                <Link
                                  className="block mb-2 last:mb-0 w-full"
                                  to={ebayStaticLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  //   onClick={() => handleResult("ebay")}
                                >
                                  <figure className="border border-[#EFF0FF] rounded-md py-3 w-full">
                                    <img
                                      src="/ebay.svg"
                                      alt=""
                                      width="150"
                                      className="mx-auto max-w-full"
                                    />
                                  </figure>
                                </Link>
                              )}
                              {amazonStaticLink !== "" && (
                                <Link
                                  target="_blank"
                                  to={amazonStaticLink}
                                  rel="noopener noreferrer"
                                  className="block mb-2 last:mb-0 w-full"
                                >
                                  <figure className="border border-[#EFF0FF] rounded-md py-3 w-full">
                                    <img
                                      src="/amazon.svg"
                                      alt=""
                                      width="187"
                                      className="max-w-full mx-auto"
                                    />
                                  </figure>
                                </Link>
                              )}
                              {youtubeStaticLink !== "" && (
                                <Link
                                  className="block mb-2 last:mb-0"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  to={youtubeStaticLink}
                                  //   onClick={() => handleResult("youtube")}
                                >
                                  <figure className="border border-[#EFF0FF] rounded-md py-3 w-full">
                                    <img
                                      src="/youtube.svg"
                                      alt=""
                                      width="187"
                                      className="mx-auto max-w-full"
                                    />
                                  </figure>
                                </Link>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GoogleCustomSearch;
