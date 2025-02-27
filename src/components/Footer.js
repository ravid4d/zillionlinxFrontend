import React from 'react'

const Footer = () => {
    return (
        <>
            <nav className="w-full mx-auto sm:flex sm:items-center sm:justify-between pb-10 pt-24">
                <div className="mx-auto transition-all flex flex-col gap-5 mt-5 sm:flex-row sm:items-center sm:justify-center text-base text-light-black uppercase">
                    <a className="hover:text-dark-blue focus:outline-none focus:text-dark-blue" href="#" aria-current="page">Home</a>
                    <div className="my-2 md:my-0 md:mx-2">
                        <div className="w-full h-px md:w-px md:h-4 bg-light-black dark:bg-neutral-700"></div>
                    </div>
                    <a className="hover:text-dark-blue focus:outline-none focus:text-dark-blue" href="#">About ZillionLinx</a>
                    <div className="my-2 md:my-0 md:mx-2">
                        <div className="w-full h-px md:w-px md:h-4 bg-light-black dark:bg-neutral-700"></div>
                    </div>
                    <a className="hover:text-dark-blue focus:outline-none focus:text-dark-blue" href="#">User Agreement</a>
                    <div className="my-2 md:my-0 md:mx-2">
                        <div className="w-full h-px md:w-px md:h-4 bg-light-black dark:bg-neutral-700"></div>
                    </div>
                    <a className="hover:text-dark-blue focus:outline-none focus:text-dark-blue" href="#">Privacy Policy</a>
                </div>
            </nav>

            <footer className="py-4 bg-dark-blue w-full">
                <div className="max-w-screen-2xl mx-auto text-center text-white">
                    Copyright © 2025 Zillion Linx. All rights reserved.
                </div>
            </footer>
        </>
    )
}

export default Footer