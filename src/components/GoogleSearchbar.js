import React from 'react'

const GoogleSearchbar = () => {
    return (
        <div className="flex items-center rounded-xl shadow-sm mb-4 relative pl-32 bg-white border border-gray-200 w-[calc(100%-375px)]">
            <span className="absolute left-3 top-0 bottom-0 my-auto flex items-center">
                <img src="/google-searchbar-icon.svg" alt="" />
            </span>

            <input type="text" placeholder='Search the web' id="hs-trailing-button-add-on-with-icon" name="hs-trailing-button-add-on-with-icon" className="h-[48px] py-3 pl-4 pr-14 block w-full border-0 rounded-xl text-sm placeholder:text-lg placeholder:text-light-black/48 focus:z-10 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none" />
            <button type="button" className="absolute z-20 right-2 top-1 w-[40px] h-[40px] shrink-0 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-xl border border-transparent bg-dark-blue text-white hover:bg-blue-700 focus:outline-none focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none">
                <svg className="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8"></circle>
                    <path d="m21 21-4.3-4.3"></path>
                </svg>
            </button>
        </div>
    )
}

export default GoogleSearchbar