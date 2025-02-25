import React, { useEffect, useState } from 'react'
import badgeData from '../json/badges.json'

const Home = () => {

    const [badges, setBadges] = useState();
    useEffect(() => {
        setBadges(badgeData);
    }, [])

    return (
        <>
            <div className="relative overflow-hidden max-w-screen-2xl mx-auto">
                <div className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-24">
                    <div className="text-center">
                        <h1 className="text-[5.7vw] leading-[6.1vw] font-medium uppercase text-dark-blue">
                            Find <span className="font-light">&</span> Bookmark <br />the good stuff
                        </h1>

                        <p className="text-[18px] text-gray-600 max-w-xl mx-auto my-16">
                            Online Bookmarks, Online Favorites. Store and organize your Bookmarks in one place. Access your Bookmarks from every computer. Search the Internet and get real answers.
                        </p>

                        <div className="space-y-4 md:space-x-4">
                            {
                                badges && badges?.length > 0 && badges?.map((badge, index) => {
                                    return (
                                        <button className="btn badge-btn" key={index}>
                                            {badge}
                                        </button>
                                    )
                                })
                            }
                        </div>

                    </div>
                </div>

            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6 lg:p-0 items-center">
                {/* First Column */}
                <div className="grid lg:grid-rows-2 gap-6 3xl:gap-10 lg:grid-flow-col">
                    <div className='lg:row-span-1 grid grid-cols-1 lg:grid-cols-5 gap-4'>
                        <div className='col-span-3 lg:col-start-2 lg:col-end-6 lg:pe-10 items'>
                            <img src="/bookmark-center.jpg" className="shadow-home-bookmark w-full border border-dark-blue/30 rounded-xl lg:rounded-[20px]" alt="Large Image" />
                        </div>
                    </div>
                    {/* Two Small Images */}
                    <div className="lg:row-span-1 grid grid-cols-1 lg:grid-cols-5 gap-6 3xl:gap-10">
                        <div className='lg:col-span-2'>
                            <img src="/bookmark-center.jpg" className="shadow-home-bookmark w-full border border-dark-blue/30 rounded-xl lg:rounded-[20px]" alt="Small Image 1" />
                        </div>
                        <div className='lg:col-span-3'>
                            <img src="/bookmark-center.jpg" className="shadow-home-bookmark w-full border border-dark-blue/30 rounded-xl lg:rounded-[20px]" alt="Small Image 2" />
                        </div>
                    </div>
                </div>

                {/* Second Column (Single Large Image) */}
                <div className='lg:row-span-2'>
                    <img src="/bookmark-center.jpg" className="shadow-home-bookmark border border-dark-blue/30 rounded-xl lg:rounded-[20px] w-full" alt="Middle Large Image" />
                </div>

                <div className="grid lg:grid-rows-2 gap-6 3xl:gap-10 lg:grid-flow-col">
                    {/* Two Small Images */}
                    <div className="lg:row-span-1 grid grid-cols-1 lg:grid-cols-5 gap-6 3xl:gap-10 lg:items-end items-center">
                        <div className='lg:col-span-3'>
                            <img src="/bookmark-center.jpg" className="shadow-home-bookmark w-full border border-dark-blue/30 rounded-xl lg:rounded-[20px]" alt="Small Image 2" />
                        </div>
                        <div className='lg:col-span-2'>
                            <img src="/bookmark-center.jpg" className="shadow-home-bookmark w-full border border-dark-blue/30 rounded-xl lg:rounded-[20px]" alt="Small Image 1" />
                        </div>
                    </div>
                    <div className='lg:row-span-1 grid lg:grid-cols-5 gap-4'>
                        <div className='col-start-1 col-end-5 lg:ps-10'>
                            <img src="/bookmark-center.jpg" className="shadow-home-bookmark w-full border border-dark-blue/30 rounded-xl lg:rounded-[20px]" alt="Large Image" />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Home