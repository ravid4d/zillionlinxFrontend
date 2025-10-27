import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  addNewBookmark,
} from "../../redux/slices/bookmarkSlice";

const AddRemoveBookmarkContext = ({ contextMenu, setContextMenu, handleOptionClick, setBookmarkIdToRegenerateThumbnail,handleRemoveItem }) => {
  const { isTopLink } = useSelector(state => state.bookmark);
  const { token } = useSelector((state) => state.auth);
  const menuRef = useRef(null);
  const dispatch = useDispatch();
  const controllerRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setContextMenu(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setContextMenu]);

  const handleAddNewBookmark = async (values) => {
    controllerRef.current = new AbortController();
    values = { ...values, url: values?.website_url, regenerate:true };
    setContextMenu(null);
    //  setBookmarkIdToRegenerateThumbnail(values?.bookmark_id);
     setBookmarkIdToRegenerateThumbnail(prev=>[...prev, values?.bookmark_id]);
     try {
       const result = await dispatch(
         addNewBookmark({ values, token, controller: controllerRef?.current })
       );
        // setBookmarkIdToRegenerateThumbnail(prev => prev.filter(id => id !== values?.bookmark_id));      
        if (addNewBookmark.fulfilled.match(result)) {
          toast.success(result.payload.message || "Thumbnail regenerated successfully!");
          // setBookmarkIdToRegenerateThumbnail(null);
          // setBookmarkIdToRegenerateThumbnail([]);
        } else {
          toast.error(result.payload?.message || "Thumbnail regeneration failed!");
        }
      } catch (error) {
       
      }
      finally {
        setBookmarkIdToRegenerateThumbnail(prev => prev.filter(id => id !== values?.bookmark_id));
      }
  };

  const doNotClick = [
    `https://zillionlinx.com/bookmark-tips3.html`,
    `https://zillionlinx.com/Instant-LinX-Help3.html`
  ];

  return (
    <div
      style={{
        position: "fixed",
        top: contextMenu.y,
        left: contextMenu.x,
        "zIndex": "99"
      }}
      ref={menuRef}
    >
      <div className="relative z-20">
        <div
          className="hs-dropdown-menu min-w-60 bg-lighter-blue border border-navy shadow-md rounded-lg mt-2"
          role="menu"
          aria-orientation="vertical"
        >
          <div className="p-1 space-y-0.5 max-w-[300px]">
            {contextMenu?.record?.add_to === "top_link" && isTopLink && (
              <button
                type="button"
                onClick={() => handleOptionClick('remove')}
                className="w-full flex items-center text-start gap-x-3 py-1.5 px-3 rounded-lg text-[16px] text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-hidden focus:bg-gray-100"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="size-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                  />
                </svg>
                <span className="w-[calc(100%-20px)]">
                  Remove from Top Links and keep in bookmarks list
                </span>
              </button>
            )}

            {contextMenu?.record?.add_to === "bookmark" && !isTopLink && (
              <button
                type="button"
                onClick={() => handleOptionClick('add')}
                className="w-full flex items-center gap-x-3 py-1.5 px-3 rounded-lg text-[16px] text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-hidden focus:bg-gray-100"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="size-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"
                  />
                </svg>
                Add to Top Links
              </button>
            )}
            {
              !doNotClick?.includes(contextMenu?.record?.website_url) ? (
              <button
                type="button"
                onClick={() => handleAddNewBookmark(contextMenu?.record)}
                className="w-full flex items-center text-start gap-x-3 py-1.5 px-3 rounded-lg text-[16px] text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-hidden focus:bg-gray-100"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-4 shrink-0">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
                </svg>
                <span className="w-[calc(100%-20px)]">
                  Refresh Thumbnail
                </span>
              </button>
              )
            : null
            }


            <button
              type="button"
              onClick={() => handleRemoveItem(contextMenu?.record?.id)}
              className="w-full flex items-center text-start gap-x-3 py-1.5 px-3 rounded-lg text-[16px] text-red-600 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-hidden focus:bg-gray-100 "
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
                  d="M6 18 18 6M6 6l12 12"
                />
              </svg>
              <span className="w-[calc(100%-20px)]">
                Delete Bookmark
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddRemoveBookmarkContext;
