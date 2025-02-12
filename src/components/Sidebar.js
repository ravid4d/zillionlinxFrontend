import React, { useEffect, useState } from 'react'
import bookmarkData from '../json/bookmarks.json';

const Sidebar = () => {
    const [bookmarks, setBookmarks] = useState([]);
    useEffect(() => {
        setBookmarks(bookmarkData);
    }, []);
    return (
        <div className='rounded-2xl bg-white p-6 min-h-screen relative h-[calc(100%-64px)]'>

            <div className='min-h-4/6 h-[70vh] '>
                <p className='text-[28px] text-dark-blue capitalize mb-5'>My Bookmarks</p>
                <ul className='rounded-xl border border-light-blue p-4 min-h-4/6 h-[70vh] bookmark-sidebar custom-scrollbar overflow-x-hidden overflow-y-auto'>
                    {
                        bookmarks && bookmarks?.length > 0 && bookmarks?.map((bookmark, index) => {
                            return (
                                <li key={index} className="hs-accordion-group hs-accordion last:mb-0 relative" id={`users-accordion_${index}`}>
                                    {
                                        index === 0 ?
                                            <svg className='absolute -left-9 top-0' width="41" height="41" viewBox="0 0 41 41" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M20.5 0L25.3271 15.5471H40.9477L28.3103 25.1558L33.1374 40.7029L20.5 31.0942L7.86262 40.7029L12.6897 25.1558L0.0522842 15.5471H15.6729L20.5 0Z" fill="#D9D9D9" />
                                            </svg> : null
                                    }

                                    <button type="button" className="rounded-lg bg-lighter-blue mb-2 py-1.5 px-2.5 flex flex-wrap items-center space-x-2 text-base text-light-black w-full focus:outline-none" aria-expanded="true" aria-controls="users-accordion-collapse-1">

                                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className='hs-accordion-toggle'>
                                            <path d="M8.00037 14.9584C11.8434 14.9584 14.9587 11.843 14.9587 8C14.9587 4.157 11.8434 1.04163 8.00037 1.04163C4.15736 1.04163 1.04199 4.157 1.04199 8C1.04199 11.843 4.15736 14.9584 8.00037 14.9584Z" stroke="#2131E5" strokeWidth="0.625" strokeMiterlimit="10" strokeLinecap="round" className='circle' />
                                            <path d="M8 4.1875V11.8125" stroke="#2131E5" strokeWidth="0.625" strokeMiterlimit="10" strokeLinecap="round" className='plus' />
                                            <path d="M4.1875 8H11.8125" stroke="#2131E5" strokeWidth="0.625" strokeMiterlimit="10" strokeLinecap="round" className='minus' />
                                        </svg>

                                        <span>{bookmark?.category}</span>
                                    </button>
                                    {
                                        bookmark?.subCategory && bookmark?.subCategory?.length > 0 &&
                                        <div id={`users-accordion-collapse-${index}`} className="hs-accordion-content w-full overflow-hidden transition-[height] duration-300 hidden" role="region" aria-labelledby={`users-accordion_${index}`}>
                                            <ul className="pt-1 ps-7 space-y-1">
                                                {
                                                    bookmark?.subCategory?.map((subCat, subIndex) => {
                                                        return (
                                                            <li className="hs-accordion-group hs-accordion relative" id={`users-accordion-sub-${subIndex}`} key={subIndex}>
                                                                <svg className="absolute -left-7 top-1" width="24" height="24" viewBox="0 0 41 41" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                    <path d="M20.5 0L25.3271 15.5471H40.9477L28.3103 25.1558L33.1374 40.7029L20.5 31.0942L7.86262 40.7029L12.6897 25.1558L0.0522842 15.5471H15.6729L20.5 0Z" fill="#FBBC05" />
                                                                </svg>

                                                                <button type="button" className="rounded-lg bg-lighter-blue mb-2 py-1.5 px-2.5 flex flex-wrap items-center space-x-2 text-base text-light-black w-full focus:outline-none" aria-expanded="true" aria-controls="users-accordion-sub-1-collapse-1">
                                                                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className='hs-accordion-toggle'>
                                                                        <path d="M8.00037 14.9584C11.8434 14.9584 14.9587 11.843 14.9587 8C14.9587 4.157 11.8434 1.04163 8.00037 1.04163C4.15736 1.04163 1.04199 4.157 1.04199 8C1.04199 11.843 4.15736 14.9584 8.00037 14.9584Z" stroke="#2131E5" strokeWidth="0.625" strokeMiterlimit="10" strokeLinecap="round" className='circle' />
                                                                        <path d="M8 4.1875V11.8125" stroke="#2131E5" strokeWidth="0.625" strokeMiterlimit="10" strokeLinecap="round" />
                                                                        <path d="M4.1875 8H11.8125" stroke="#2131E5" strokeWidth="0.625" strokeMiterlimit="10" strokeLinecap="round" />
                                                                    </svg>
                                                                    <span>{subCat?.category}</span>
                                                                </button>


                                                                {/* <div id="users-accordion-sub-1-collapse-1" className="hs-accordion-content w-full overflow-hidden transition-[height] duration-300 hidden" role="region" aria-labelledby="users-accordion-sub-1">
                                                            <ul className="pt-1 ps-7 space-y-1">
                                                                <li>
                                                                    <button type="button" className="rounded-lg bg-lighter-blue mb-2 py-1.5 px-2.5 flex flex-wrap items-center space-x-2 text-base text-light-black w-full focus:outline-none" aria-expanded="true" aria-controls="users-accordion-sub-1-collapse-1">
                                                                        <span>Link 1</span>
                                                                    </button>
                                                                </li>
                                                                <li>
                                                                    <button type="button" className="rounded-lg bg-lighter-blue mb-2 py-1.5 px-2.5 flex flex-wrap items-center space-x-2 text-base text-light-black w-full focus:outline-none" aria-expanded="true" aria-controls="users-accordion-sub-1-collapse-1">
                                                                        <span>Link 2</span>
                                                                    </button>
                                                                </li>
                                                                <li>
                                                                    <button type="button" className="rounded-lg bg-lighter-blue mb-2 py-1.5 px-2.5 flex flex-wrap items-center space-x-2 text-base text-light-black w-full focus:outline-none" aria-expanded="true" aria-controls="users-accordion-sub-1-collapse-1">
                                                                        <span>Link 3</span>
                                                                    </button>
                                                                </li>
                                                            </ul>
                                                        </div> */}
                                                            </li>
                                                        )
                                                    })
                                                }
                                            </ul>
                                        </div>

                                    }
                                </li>
                            )
                        })
                    }

                    {/* {
                        bookmarks && bookmarks?.length > 0 && bookmarks?.map((bookmark, index) => {
                            return (
                                <li key={index} className='rounded-md bg-light-blue mb-2 py-1.5 px-2 flex flex-wrap items-center space-x-2 text-base text-light-black last:mb-0'>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                    </svg>
                                    <span>{bookmark?.category}</span>
                                </li>
                            )
                        })
                    } */}
                </ul>
            </div>
            <div className='bg-dark-blue rounded-xl text-xl text-white gap-2 items-center pl-[120px] py-2 pr-3 absolute bottom-8 left-6 right-6 mx-auto'>
                <div className='absolute left-2 top-2 w-[85px]'>
                    <img src="/search-bookmark-icon.png" alt="" className="w-full" />
                </div>
                <div className=''>
                    Search for Pre-populated Bookmark Collections.
                </div>
            </div>
        </div>
    )
}

export default Sidebar