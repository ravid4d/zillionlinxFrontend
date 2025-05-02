import React, { useEffect, useRef } from 'react'

const BookmarkGoogleResultContext = ({contextMenu, setContextMenu, handleOptionClick }) => {
  const menuRef = useRef(null);
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
  return (
    <div
    style={{
      position: "fixed",
      top: contextMenu.y,
      left: contextMenu.x,
      "zIndex":"99"
    }}
    ref={menuRef}
  >
    <div className="relative z-20">
      <div
        className="hs-dropdown-menu min-w-60 bg-lighter-blue border border-navy shadow-md rounded-lg mt-2"
        role="menu"
        aria-orientation="vertical"
      >
        <div className="p-1 space-y-0.5">
          <button
            type="button"
            onClick={()=>handleOptionClick('bookmark')}
            className="w-full flex items-center gap-x-3 py-1.5 px-3 rounded-lg text-[16px] text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-hidden focus:bg-gray-100 "
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
            Add to bookmarks
          </button>
          <button
            type="button"
            onClick={() => handleOptionClick("top_link")}
            className="w-full flex items-center gap-x-3 py-1.5 px-3 rounded-lg text-[16px] text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-hidden focus:bg-gray-100 "
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
            Add to top links
          </button>
        </div>
      </div>
    </div>
  </div>
  )
}

export default BookmarkGoogleResultContext
