import React from 'react'
import { Link } from 'react-router-dom'

const Footer = () => {
    return (
        <>
            <nav className="w-full mx-auto sm:flex sm:items-center sm:justify-between pb-10 pt-24">
                <div className="mx-auto transition-all flex flex-col gap-5 mt-5 sm:flex-row sm:items-center sm:justify-center text-base text-light-black uppercase">
                    <Link className="hover:text-dark-blue focus:outline-none focus:text-dark-blue" to="/">Home</Link>
                    <div className="my-2 md:my-0 md:mx-2">
                        <div className="w-full h-px md:w-px md:h-4 bg-light-black dark:bg-neutral-700"></div>
                    </div>
                    <Link className="hover:text-dark-blue focus:outline-none focus:text-dark-blue" to="/about">About ZillionLinx</Link>
                    <div className="my-2 md:my-0 md:mx-2">
                        <div className="w-full h-px md:w-px md:h-4 bg-light-black dark:bg-neutral-700"></div>
                    </div>
                    <Link className="hover:text-dark-blue focus:outline-none focus:text-dark-blue" to="/user-agreement">User Agreement</Link>
                    <div className="my-2 md:my-0 md:mx-2">
                        <div className="w-full h-px md:w-px md:h-4 bg-light-black dark:bg-neutral-700"></div>
                    </div>
                    <Link className="hover:text-dark-blue focus:outline-none focus:text-dark-blue" to="/privacy-policy">Privacy Policy</Link>
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