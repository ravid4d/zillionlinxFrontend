import React, { useEffect, useRef, useState } from "react";
import GoogleSearchbar from "../../components/elements/GoogleSearchbar";
import { Link, useLocation, useNavigate, useOutletContext } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { googleSearch } from "../../redux/slices/bookmarkSlice";
import BookmarkGoogleResultContext from "../../components/bookmark/BookmarkGoogleResultContext";

const GoogleCustomSearch = () => {
  const { setUrlToBookmark, setWhichModalOpen } = useOutletContext();
  const { token } = useSelector((state) => state.auth);
  const [noContent, setNoContent] = useState(false);
  const [mainContent, setMainContent] = useState([]);
  const [contextMenu, setContextMenu] = useState(null);
  const googleRef = useRef(null);
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
    listingType
  } = useSelector((state) => state.bookmark);
  const dispatch = useDispatch();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const query = searchParams.get("query");
 const navigate = useNavigate();

 useEffect(() => {
    const onContextMenu = (e) => {
      // Find the result element (Google renders results with this class)
      const resultEl = e.target.closest(".gsc-webResult");
      const container = document.querySelector(".gsc-expansionArea");

      // If click wasn't inside a result, ignore
      if (!resultEl || !container || !container.contains(resultEl)) return;

      // Extract title + link
      const linkEl = resultEl.querySelector("a.gs-title");
      const title = linkEl?.innerText?.trim() ?? "";
      const link =
        linkEl?.getAttribute("data-ctorig") || // original link if present
        linkEl?.getAttribute("href") ||
        "";

      // Prevent browser default context menu
      e.preventDefault();

      // Call your handler
      handleRightClick(e, { title, link });
    };

    // Attach global event listener (capture phase helps if GCS stops bubbling)
    document.addEventListener("contextmenu", onContextMenu, true);

    // Cleanup on unmount
    return () => {
      document.removeEventListener("contextmenu", onContextMenu, true);
    };
  }, []);
  

useEffect(() => {
  const updateResultLinks = (root = document) => {
    const links = root.querySelectorAll("a.gs-title");
    links.forEach((link) => {
      link.setAttribute("target", "_blank");
      link.setAttribute("rel", "noopener noreferrer");
    });
  };

  // Run once initially (in case results are already there)
  updateResultLinks(document);

  // Watch for dynamically added links
  const observer = new MutationObserver((mutations) => {
    for (const m of mutations) {
      m.addedNodes.forEach((node) => {
        if (node instanceof HTMLElement) {
          // Check if the new node is a link or contains links
          if (node.matches("a.gs-title")) {
            updateResultLinks(node.parentNode || node);
          } else if (node.querySelector && node.querySelector("a.gs-title")) {
            updateResultLinks(node);
          }
        }
      });
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });

  return () => observer.disconnect();
}, []);


  useEffect(() => {
    if (!query) {
      setNoContent(true);
      return;
    }

    let formData = new FormData();
    formData.append("search", query);

    dispatch(googleSearch({ token, formData })).then((result) => {
      if (!result.payload || result.payload?.length === 0) {
        setNoContent(true);
      } else {
        setNoContent(false); 
        // let googleResultWrapper = document.querySelector(".gsc-expansionArea");
        // let googleResults = googleResultWrapper?.querySelectorAll(".gsc-webResult");
        // googleResults?.forEach(result=>{
        //   let title = result.querySelector("a.gs-title").innerText;
        //   let link = result.querySelector("a.gs-title").getAttribute('href');
        //   let record = {title, link};
        //   result.addEventListener("contextmenu", (event) => handleRightClick(event, record));
        // });
      }
    });
  }, [query, dispatch, token]);

useEffect(() => {
    let observer = null;
    const attached = new Set(); // keep track of attached elements to avoid dupes

    const updateUrlFromInput = (inputEl) => {
      const val = (inputEl?.value || "").trim();
      if (!val) return;

      const url = new URL(window.location.href);

      // update ?query param
      url.searchParams.set("query", val);

      // update Google hash fragment to keep parity with GCS UI
      // We set the hash without the leading '#', URL.hash needs the '#',
      // but URL.hash property will add '#' automatically when set to a string,
      // so set url.hash = '#...'
      url.hash = `#gsc.tab=0&gsc.q=${encodeURIComponent(val)}&gsc.sort=`;

      // replace state without navigation
      // navigate(url.pathname + url.search + url.hash, { replace: true });
      window.history.replaceState({}, "", url.toString());

      document.querySelector("a.gs-title").setAttribute("target", "_blank");
      document.querySelector("a.gs-title").setAttribute("rel", "noopener noreferrer");

    };

    const onInputKeyDown = (ev) => {
      // capture Enter pressing inside the input — this runs before many other handlers when capture=true
      if (ev.key === "Enter") {
        const input = ev.target.closest ? ev.target.closest("input.gsc-input") : document.querySelector("input.gsc-input");
        // use a tiny timeout so Google can process its own handlers if needed; but usually not required
        // keep it small (0ms) to let event loop cycle
        setTimeout(() => updateUrlFromInput(input), 0);
      }
    };

    const onInputEvent = (ev) => {
      // live update when user types (optional)
      const input = ev.target.closest ? ev.target.closest("input.gsc-input") : document.querySelector("input.gsc-input");
      // update but don't require non-empty; you can decide to clear param when empty
      setTimeout(() => updateUrlFromInput(input), 0);
    };

    const onFormSubmit = (ev) => {
      // form submit (Enter or clicking button that submits form)
      const form = ev.target.closest ? ev.target.closest("form.gsc-search-box-tools") : document.querySelector("form.gsc-search-box-tools");
      const input = form?.querySelector("input.gsc-input");
      // do update after a micro-delay
      setTimeout(() => updateUrlFromInput(input), 0);
    };

    const onButtonClick = (ev) => {
      const input = document.querySelector("input.gsc-input");
      setTimeout(() => updateUrlFromInput(input), 0);
    };

    const attachHandlers = (root = document) => {
      // find elements
      const input = root.querySelector ? root.querySelector("input.gsc-input") : document.querySelector("input.gsc-input");
      const form = root.querySelector ? root.querySelector("form.gsc-search-box-tools") : document.querySelector("form.gsc-search-box-tools");
      const btn = root.querySelector ? root.querySelector(".gsc-search-button-v2") : document.querySelector(".gsc-search-button-v2");

      if (input && !attached.has(input)) {
        input.addEventListener("keydown", onInputKeyDown, true); // capture phase to catch Enter early
        input.addEventListener("input", onInputEvent, false);
        input.addEventListener("change", onInputEvent, false);
        attached.add(input);
      }

      if (form && !attached.has(form)) {
        form.addEventListener("submit", onFormSubmit, true);
        attached.add(form);
      }

      if (btn && !attached.has(btn)) {
        btn.addEventListener("click", onButtonClick, true);
        attached.add(btn);
      }
    };

    // If elements already exist when effect runs, attach immediately
    attachHandlers(document);

    // Observe DOM for late-inserted GCS elements (when gcse.js renders them async)
    observer = new MutationObserver((mutations) => {
      for (const m of mutations) {
        // check added nodes quickly for relevant selectors
        if (m.addedNodes && m.addedNodes.length) {
          m.addedNodes.forEach((node) => {
            // if node is an element, try to attach using it as root
            if (node instanceof HTMLElement) {
              // If whole wrapper was inserted (common), attach from that node
              if (node.matches && (node.matches(".gsc-search-box-tools") || node.matches(".gsc-search-box") || node.matches(".gsc-expansionArea") || node.querySelector("input.gsc-input"))) {
                attachHandlers(node);
              } else {
                // maybe deeper nodes contain the elements
                attachHandlers(node);
              }
            }
          });
        }
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    // cleanup
    return () => {
      // disconnect observer
      if (observer) observer.disconnect();

      // remove event listeners we attached
      attached.forEach((el) => {
        try {
          el.removeEventListener("keydown", onInputKeyDown, true);
          el.removeEventListener("input", onInputEvent, false);
          el.removeEventListener("change", onInputEvent, false);
          el.removeEventListener("submit", onFormSubmit, true);
          el.removeEventListener("click", onButtonClick, true);
        } catch (err) {
          // ignore
        }
      });
      attached.clear();
    };
  }, []);



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
      record: record // Save clicked record
    });
  };

  const handleOptionClick = (option) => {
    contextMenu.record = { ...contextMenu.record, type: option };
    // console.log(contextMenu, 'contextMenu')
    setUrlToBookmark(contextMenu);
    // setSelectedRecord({ ...contextMenu.record, type: option }); // Save record with type
    setContextMenu(null); // Close context menu
    setWhichModalOpen("newBookmark"); // Show second modal
  };
  useEffect(() => {
    // let cx = process.env.REACT_APP_GOOGLE_SEARCH_CX;
    const script = document.createElement("script");
    // Need to add cx static because it opens the results in modal
    script.src = "https://cse.google.com/cse.js?cx=96b337026d2404c75";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  return (
    <div className="max-w-screen-xl mx-auto px-4 sm:px-6 xl:px-2 h-full">
      <div className="bg-white sm:rounded-tl-[20px] rounded-bl-[20px] rounded-br-[20px] p-4 xl:p-8 h-full">
        <div className="flex flex-wrap lg:space-x-8 h-full">
          <div className="bookmark-content-wrappers w-full h-full">
            <div className="flex flex-wrap md:items-start gap-x-4 justify-between">
              <div className="bg-white rounded-xl p-3 mb-4 w-full lg:w-[calc(50%-25px)]">
                Hint: Right Click on any URL / Title below to Bookmark that Link
              </div>
              {/* <div className={`google-search-wrap flex items-start justify-end gap-4 mb-4 relative  ${
        location.pathname === "/bookmarks"
          ? "max-w-full xl:w-[calc(100%-375px)]"
          : "w-full md:w-[calc(50%-25px)]"
      } `}> */}
                {/* <div className="gcse-searchbox" data-gname="storesearch"></div>
             </div> */}
              <GoogleSearchbar googleRef={googleRef} listingType="link" />
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
                      <div className="flex flex-wrap items-center space-x-3 mb-2 text-sm">
                        <img src="/google.png" alt="" width="100" />
                        <p>Google Custom Search</p>
                      </div>
                      <div className="w-full rounded-xl border border-light-blue p-6 overflow-auto custom-scrollbar h-[calc(100%-75px)] max-h-96 lg:max-h-full">
                        <div className="gcse-searchresults" data-gname="storesearch"></div>
                        {loading?.googleSearch ? (
                          <span className="loader"></span>
                        ) : (
                          <></>
                          // mainContent &&
                          // mainContent?.length > 0 &&
                          // mainContent?.map((result, index) => {
                          //   return (
                          //     <div className="mb-4 last:mb-0" key={index}>
                          //       <Link
                          //         to={result?.link}
                          //         className={`block google_result google_result_${index}`}
                          //         target="_blank"
                          //         onContextMenu={(e) =>
                          //           handleRightClick(e, result)
                          //         }
                          //       >
                          //         {result?.thumbnail ? (
                          //           <img
                          //             src={result?.thumbnail}
                          //             alt={result?.title}
                          //           />
                          //         ) : null}
                          //         <div className="text-dark-blue text-md text-ellipsis overflow-hidden text-nowrap">
                          //           {result?.title}
                          //         </div>
                          //       </Link>
                          //       <p className="text-[13px] text-light-black">
                          //         {result?.snippet}
                          //       </p>
                          //       <span className="block text-[13px] text-[#009933]">
                          //         {result?.breadcrumb}
                          //       </span>
                          //     </div>
                          //   );
                          // })
                        )}
                        {contextMenu && (
                          <BookmarkGoogleResultContext
                            setContextMenu={setContextMenu}
                            contextMenu={contextMenu}
                            handleOptionClick={handleOptionClick}
                          />
                        )}
                      </div>
                    </div>
                    <div
                      className={`w-full lg:w-2/6 rounded-2xl lg:ps-6 h-full`}
                    >
                      <div className="bg-white h-full">
                        <div className="flex flex-wrap items-center space-x-3 mb-0 text-sm">
                          <img
                            src="/google.png"
                            alt=""
                            width="100"
                            className="mt-5 lg:mt-0 block mb-2"
                          />
                          <p>Images</p>
                        </div>
                        <div className="bg-white rounded-xl border border-light-blue p-4 custom-scrollbar overflow-auto custom-scrollbar h-[calc(100%-72px)]">
                          <ul className="grid grid-cols-1 gap-4">
                            {loading?.googleSearch ? (
                              <span className="loader"></span>
                            ) : (
                              googleResults &&
                              googleResults?.length > 0 &&
                              googleResults?.map((result, index) => {
                                return (
                                  <>
                                    {result.image && (
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
                                    )}
                                  </>
                                );
                              })
                            )}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className={`w-full lg:w-1/5 rounded-2xl lg:ps-6 h-full`}>
                    <div className="bg-white rounded-xl h-full flex flex-wrap flex-col justify-between space-y-5">
                      <div className="bg-white rounded-xl border border-light-blue w-full overflow-auto flex-1 p-2">
                        <p className="text-[20px] text-dark-blue mb-3">
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
                                      width="140"
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
                                      width="140"
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
                                      width="140"
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
                                      width="140"
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
                                      width="140"
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

                              {/* {neweggStaticLink && (
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
                                      width="140"
                                      className="mx-auto max-w-full"
                                    />
                                  </figure>
                                </Link>
                              )} */}
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
                                      width="140"
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
                        <span className="block">Disclaimer:</span> This site
                        contains affiliate links. As an associate or partner of
                        Amazon, eBay, YouTube, Walmart, Etsy, and AliExpress, I
                        may earn a commission from qualifying purchases made
                        through these links — at no extra cost to you.
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
