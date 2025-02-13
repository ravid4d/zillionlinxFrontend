import React, { useEffect, useRef, useState } from 'react'
import Sidebar from '../components/Sidebar'
import bookmarkData from '../json/bookmarks.json';
import Searchbar from '../components/Searchbar';
import GoogleSearchbar from '../components/GoogleSearchbar';
import AddNewBookmark from '../components/AddNewBookmark';

const MyBookmarks = () => {
    const btnRef = useRef(null);
    const [inputValue, setInputValue] = useState("");
    const [items, setItems] = useState([]);
    const [draggedIndex, setDraggedIndex] = useState(null);
    const [openAddNewBookmarkModal, setOpenAddNewBookmarkModal] = useState(false);

    useEffect(() => {
        setItems(bookmarkData);
    }, []);

    // When drag starts, store the item's index
    const handleDragStart = (index) => {
        setDraggedIndex(index);
    };

    // When dragged over another item, reorder the list
    const handleDragOver = (index) => {
        if (draggedIndex === null || draggedIndex === index) return;

        const newItems = [...items];
        const draggedItem = newItems.splice(draggedIndex, 1)[0]; // Remove dragged item
        newItems.splice(index, 0, draggedItem); // Insert at new position

        setDraggedIndex(index); // Update dragged index
        setItems(newItems);
    };

    // Reset dragged item index on drag end
    const handleDragEnd = () => {
        setDraggedIndex(null);
    };

    // Remove an item form list
    const handleRemoveItem = (index) => {
        const updatedItems = items.filter((_, i) => i !== index);
        setItems(updatedItems);
    };

    //Open Add New Bookmark Modal
    const addBookmarkViaUrl = () => {
        let inputField = document.getElementById("add_url_to_bookmark");
        inputField.blur();
        btnRef.current.click();
        setOpenAddNewBookmarkModal(true);
        setTimeout(() => {
            setInputValue("");
        }, 500);
    }

    return (
        <div className='max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8'>

            {/* <AddNewBookmark btnRef={btnRef} openAddNewBookmarkModal={openAddNewBookmarkModal} setOpenAddNewBookmarkModal={setOpenAddNewBookmarkModal} /> */}

            <button type="button" className="size-8 lg:hidden flex justify-center items-center gap-x-2 border border-gray-200 text-gray-800 hover:text-gray-500 rounded-lg focus:outline-none focus:text-gray-500 disabled:opacity-50 disabled:pointer-events-none" aria-haspopup="dialog" aria-expanded="false" aria-controls="hs-application-sidebar" aria-label="Toggle navigation" data-hs-overlay="#hs-application-sidebar">
                <span className="sr-only">Toggle Navigation</span>
                <svg className="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" /><path d="M15 3v18" /><path d="m8 9 3 3-3 3" /></svg>
            </button>
            <div className="bg-navy rounded-l-[20px] rounded-br-[20px] p-8">
                <div className='flex flex-wrap lg:space-x-8'>
                    {/* <div className='bookmark-sidebar-wrapper'> */}
                    <div
                        id="hs-application-sidebar"
                        className="
                                bookmark-sidebar-wrapper    
                                hs-overlay  [--auto-close:lg]
                                hs-overlay-open:translate-x-0         
                                -translate-x-full lg:translate-x-0 transition-all duration-300 transform
                                fixed lg:relative inset-y-0 start-0 z-[60] lg:block
                            "
                        role="dialog"
                        tabIndex="-1"
                        aria-label="Sidebar">
                        <Searchbar />
                        <Sidebar />

                    </div>
                    {/* </div> */}
                    <div className='bookmark-content-wrapper'>
                        <div className='flex flex-wrap items-center justify-between'>
                            <div className="flex items-center rounded-xl shadow-sm mb-4 relative add-url-to-bookmark w-[350px]">
                                <input type="text" value={inputValue} onChange={(e) => setInputValue(e.target.value)} placeholder='Add an URL to Your Bookmarks' id="add_url_to_bookmark" name="add_url_to_bookmark" className="h-[48px] py-3 pl-4 pr-14 block w-full border-gray-200 rounded-xl text-sm placeholder:text-lg placeholder:text-light-black/48 focus:z-10 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none" />
                                <button type="button" onClick={addBookmarkViaUrl} className="absolute z-20 right-2 top-1 w-[40px] h-[40px] inline-flex justify-center items-center border border-transparent bg-transparent hover:bg-transparent focus:outline-none focus:bg-transparent disabled:opacity-50 disabled:pointer-events-none">
                                    <img src="/submit-icon.png" alt="" className='' />
                                </button>
                            </div>
                            <GoogleSearchbar />
                        </div>
                        <div className='rounded-2xl bg-white p-6 h-[calc(100%-64px)]'>
                            <p className='text-[28px] text-dark-blue capitalize mb-5 pt-6'>Top Links <span className='text-base text-light-black inline-block ml-4'>(Drag and drop thumbnails to position top links or pin to a grid location)</span></p>
                            <div className='rounded-xl border border-light-blue p-6 overflow-auto custom-scrollbar h-[calc(100vh-66px)]'>
                                <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 2xl:grid-cols-3 gap-7">
                                    {items && items?.length > 0 && items?.map((item, index) => (
                                        <li
                                            key={index}
                                            draggable
                                            onDragStart={() => handleDragStart(index)}
                                            onDragOver={() => handleDragOver(index)}
                                            onDragEnd={handleDragEnd}
                                            className="relative"
                                            style={{ opacity: draggedIndex === index ? 0.5 : 1 }}
                                        >
                                            <span className='bg-white relative overflow-hidden rounded-xl block shadow-bookmark border border-dark-blue/30'>
                                                <span
                                                    className='pin-icon w-6 h-6 rounded-full bg-light-blue flex flex-wrap items-center justify-center cursor-move absolute left-2 top-2'>
                                                    <svg width="11" height="10" viewBox="0 0 11 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M10.0377 3.96597L6.73769 0.665967C6.58769 0.515967 6.36269 0.515967 6.21269 0.665967L5.01269 1.86597C4.82519 2.05347 4.90019 2.27847 5.01269 2.39097L5.27519 2.65347L4.15019 3.77847C3.58769 3.66597 2.0502 3.40347 1.2252 4.22847C1.0752 4.37847 1.0752 4.60347 1.2252 4.75347L3.36269 6.89097L1.0002 9.25347C0.850195 9.40347 0.850195 9.62847 1.0002 9.77847C1.1502 9.92847 1.4127 9.89097 1.5252 9.77847L3.88769 7.41597L6.02519 9.55347C6.25019 9.74097 6.47519 9.66597 6.55019 9.55347C7.37519 8.72847 7.11269 7.19097 7.00019 6.62847L8.12519 5.50347L8.38769 5.76597C8.53769 5.91597 8.76269 5.91597 8.91269 5.76597L10.1127 4.56597C10.1877 4.34097 10.1877 4.11597 10.0377 3.96597Z" fill="#2131E5" />
                                                    </svg>
                                                </span>
                                                <img src="/bookmark-center.jpg" alt="" className='w-full' />
                                                <span className='block g-white text-center underline text-xl py-2 px-4 whitespace-nowrap text-ellipsis overflow-hidden'>Bank of America</span>
                                            </span>
                                            <span onClick={() => handleRemoveItem(index)} className='cross-icon w-6 h-6 rounded-full bg-dark-blue flex flex-wrap items-center justify-center cursor-pointer absolute -right-2 -top-2 transition-all hover:bg-red-500'>
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#C0C6FF" className="size-4">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                                                </svg>
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    )
}

export default MyBookmarks;