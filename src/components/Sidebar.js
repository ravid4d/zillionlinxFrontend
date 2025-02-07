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
                <ul className='rounded-xl border border-light-blue p-6 min-h-4/6 h-[70vh] custom-scrollbar overflow-auto'>
                    {
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
                    }
                </ul>
            </div>
            <div className='bg-dark-blue rounded-xl text-xl text-white gap-2 items-center pl-[120px] py-2 pr-3 absolute bottom-8 left-6 right-6 mx-auto'>
                <div className='absolute left-3 -bottom-3 w-[100px] '>
                    <img src="/import-icon.png" alt="" className="w-full" />
                </div>
                <div className=''>
                    Import Z-Linx: Pre-populated Bookmark Collections.
                </div>
            </div>
        </div>
    )
}

export default Sidebar