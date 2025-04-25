import React, { useEffect, useState } from "react";
import GoogleSearchbar from "../../components/elements/GoogleSearchbar";
import {
  Link,
  useLocation,
  useOutletContext
} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { googleSearch } from "../../redux/slices/bookmarkSlice";
import BookmarkGoogleResultContext from "../../components/bookmark/BookmarkGoogleResultContext";

const GoogleCustomSearch = () => {
  const { setUrlToBookmark, setWhichModalOpen } = useOutletContext();
  const { token } = useSelector((state) => state.auth);
  const [noContent, setNoContent] = useState(false);
  const [mainContent, setMainContent] = useState([]);
  const [contextMenu, setContextMenu] = useState(null); 

  const {
    googleResults,
    loading,
    youtubeStaticLink,
    ebayStaticLink,
    amazonStaticLink,
    walmartStaticLink,
    aliexpressStaticLink,
    etsyStaticLink,
    neweggStaticLink,
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
      setContextMenu(null); // Close context menu
      setWhichModalOpen("newBookmark"); // Show second modal
  };

  return (
    <div className="max-w-screen-xl mx-auto px-4 sm:px-6 xl:px-2 h-full">
      <div className="bg-white sm:rounded-tl-[20px] rounded-bl-[20px] rounded-br-[20px] p-4 xl:p-8 h-full">
        <div className="flex flex-wrap lg:space-x-8 h-full">
          <div className="bookmark-content-wrappers w-full h-full">
            <div className="flex flex-wrap flex-col md:flex-row md:items-start gap-x-4 justify-between">
              <div className="bg-white rounded-xl p-3 mb-4 w-full md:w-[calc(50%-25px)]">
                Hint: Right Click on any URL / Title below to Bookmark that Link
              </div>
              <GoogleSearchbar />
            </div>
            <div className="rounded-2xl lg:h-[calc(100%-64px)] flex flex-wrap">
              {noContent ? (
                <div className="text-center w-full p-6 bg-white rounded-xl">
                  <h1 className="text-2xl font-bold">No Content Found</h1>
                  <p>Try searching for something else.</p>
                </div>
              ) : (
                <>
                  <div className="bg-white w-full lg:w-4/5 rounded-xl border border-light-blue p-6 flex flex-wrap h-full mb-5 lg:mb-0">
                    <div className="w-full lg:w-4/6 h-full">
                      <div className="flex flex-wrap items-center space-x-5 mb-2">
                        <img src="/google.svg" alt="" width="160" />
                        <p>Google Custom Search</p>
                      </div>
                      <div className="w-full rounded-xl border border-light-blue p-6 overflow-auto custom-scrollbar h-[calc(100%-75px)] max-h-96 lg:max-h-full">
                        {loading?.googleSearch ? (
                          <span className="loader"></span>
                        ) : (
                          mainContent &&
                          mainContent?.length > 0 &&
                          mainContent?.map((result, index) => {
                            return (
                                <Link
                                  key={index}
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
                            );
                          })
                        )}
                        {contextMenu && 
                          <BookmarkGoogleResultContext  setContextMenu={setContextMenu}  contextMenu={contextMenu} handleOptionClick={handleOptionClick} />
                        }
                      </div>
                    </div>
                    <div className={`w-full lg:w-2/6 rounded-2xl lg:ps-6 h-full`}>
                      <div className="bg-white h-full">
                        <img
                          src="/google-image.png"
                          alt=""
                          width="200"
                          className="mt-5 lg:mt-0 lg:mx-auto block mb-2"
                        />
                        <div className="bg-white rounded-xl border border-light-blue p-4 overflow-auto custom-scrollbar overflow-auto custom-scrollbar h-[calc(100%-72px)]">
                          <ul className="grid grid-cols-1 gap-4">
                            {loading?.googleSearch ? (
                              <span className="loader"></span>
                            ) : (
                              googleResults &&
                              googleResults?.length > 0 &&
                              googleResults?.map((result, index) => {
                                return (
                                  <li key={index} className="relative">
                                    <span className="bg-whtie relative overflow-hidden rounded-xl block border border-dark-blue/30">
                                      <Link
                                        className="block overflow-hidden object-cover object-top"
                                        // to={result?.website_url}
                                        to={result?.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                      >
                                        <img
                                          alt=""
                                          className="w-full"
                                          // src={`${process.env.REACT_APP_API_URL}/storage/${result.image}`}
                                          src={result.image}
                                        />
                                      </Link>
                                      <Link
                                        // to={result?.website_url}
                                        to={result?.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                      >
                                        <span className="block g-white text-center underline text-[16px] py-2 px-4 whitespace-nowrap text-ellipsis overflow-hidden">
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
                  <div className={`w-full lg:w-1/5 rounded-2xl lg:ps-6 h-full`}>
                    <div className="bg-white rounded-xl p-4 h-full flex flex-wrap flex-col justify-between space-y-5">
                      <div className="bg-white rounded-xl border border-light-blue w-full overflow-auto flex-1 p-2">
                        <p className="text-[20px] text-dark-blue capitalize mb-3">
                        Find it here
                        </p>
                        <div className="overflow-auto custom-scrollbar h-[calc(100%-45px)] flex flex-wrap flex-col md:flex-row md:block">
                          {loading?.googleSearch ? (
                            <span className="loader"></span>
                          ) : (
                            <>
                              {amazonStaticLink && (
                                <Link
                                  target="_blank"
                                  to={amazonStaticLink}
                                  rel="noopener noreferrer"
                                  className="block mb-1 last:mb-0 w-full"
                                >
                                  <figure className="border border-[#EFF0FF] rounded-md p-1 w-full">
                                    <img
                                      src="/amazon.png"
                                      alt=""
                                      width="120"
                                      className="max-w-full mx-auto"
                                    />
                                  </figure>
                                </Link>
                              )}
                               {walmartStaticLink && (
                                <Link
                                  className="block mb-1 last:mb-0 w-full"
                                  to={walmartStaticLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  <figure className="border border-[#EFF0FF] rounded-md p-1 w-full">
                                    <img
                                      src="/walmart.png"
                                      alt=""
                                      width="120"
                                      className="mx-auto max-w-full"
                                    />
                                  </figure>
                                </Link>
                               )} 
                                 {etsyStaticLink && (
                                <Link
                                  className="block mb-1 last:mb-0 w-full"
                                  to={etsyStaticLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  <figure className="border border-[#EFF0FF] rounded-md p-1 w-full">
                                    <img
                                      src="/etsy.png"
                                      alt=""
                                      width="120"
                                      className="mx-auto max-w-full"
                                    />
                                  </figure>
                                </Link>
                              )}
                               {ebayStaticLink && (
                                <Link
                                  className="block mb-1 last:mb-0 w-full"
                                  to={ebayStaticLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  <figure className="border border-[#EFF0FF] rounded-md p-1 w-full">
                                    <img
                                      src="/ebay.png"
                                      alt=""
                                      width="120"
                                      className="mx-auto max-w-full"
                                    />
                                  </figure>
                                </Link>
                              )}
                                {aliexpressStaticLink && (
                                <Link
                                  className="block mb-1 last:mb-0 w-full"
                                  to={aliexpressStaticLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  <figure className="border border-[#EFF0FF] rounded-md p-1 w-full">
                                    <img
                                      src="/ali-express.png"
                                      alt=""
                                      width="120"
                                      className="mx-auto max-w-full"
                                    />
                                  </figure>
                                </Link>
                               )} 




                              {/* {wikiStaticLink && (
                                <Link
                                  className="block mb-1 last:mb-0 w-full"
                                  to={wikiStaticLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  <figure className="border border-[#EFF0FF] rounded-md p-1 w-full">
                                    <img
                                      src="/wikki.svg"
                                      alt=""
                                      width="150"
                                      className="mx-auto max-w-full"
                                    />
                                  </figure>
                                </Link>
                              )}                         */}
                            
                             
                              
                             
                             
                               {neweggStaticLink && (
                                <Link
                                  className="block mb-1 last:mb-0 w-full"
                                  to={neweggStaticLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  <figure className="border border-[#EFF0FF] rounded-md p-1 w-full">
                                    <img
                                      src="/new-egg.png"
                                      alt=""
                                      width="120"
                                      className="mx-auto max-w-full"
                                    />
                                  </figure>
                                </Link>
                               )} 
                               {/* {mercadolibreStaticLink && (
                                <Link
                                  className="block mb-1 last:mb-0 w-full"
                                  to={mercadolibreStaticLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  <figure className="border border-[#EFF0FF] rounded-md p-1 w-full">
                                    <img
                                      src="/mercado.jpg"
                                      alt=""
                                      width="150"
                                      className="mx-auto max-w-full"
                                    />
                                  </figure>
                                </Link>
                               )}  */}
                                {youtubeStaticLink && (
                                <Link
                                  className="block mb-1 last:mb-0 w-full"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  to={youtubeStaticLink}
                                >
                                  <figure className="border border-[#EFF0FF] rounded-md p-1 w-full">
                                    <img
                                      src="/youtube.png"
                                      alt=""
                                      width="120"
                                      className="mx-auto max-w-full"
                                    />
                                  </figure>
                                </Link>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                      <div className="bg-white rounded-xl border border-light-blue h-fit p-2 text-sm overflow-auto custom-scrollbar text-center">
                        <span className="block">Disclaimer:</span> This site contains affiliate links. As an associate or partner of Amazon, eBay, YouTube, Walmart, Etsy, and AliExpress, I may earn a commission from qualifying purchases made through these links — at no extra cost to you.
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
