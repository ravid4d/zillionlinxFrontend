import React from "react";
import { Link } from "react-router-dom";

const Footer = ({redirectTo}) => {
 
  return (
    <footer className="w-full">
      <nav className="w-full mx-auto sm:flex sm:items-center sm:justify-between py-10">
        <div className="px-4 mx-auto transition-all flex gap-3 md:gap-5 mt-5 flex-row flex-wrap items-center justify-center text-base text-light-black uppercase">
          <button
            className="hover:text-dark-blue focus:outline-none focus:text-dark-blue"
            onClick={redirectTo}
          >
            Home
          </button>
          <div className="my-2 md:my-0 md:mx-2">
            <div className="h-px w-px h-4 bg-light-black"></div>
          </div>
          <Link
            className="hover:text-dark-blue focus:outline-none focus:text-dark-blue"
            to="/about"
          >
            About ZillionLinx
          </Link>
          <div className="my-2 md:my-0 md:mx-2">
            <div className="h-px w-px h-4 bg-light-black"></div>
          </div>
          <Link
            className="hover:text-dark-blue focus:outline-none focus:text-dark-blue"
            to="/user-agreement"
          >
            User Agreement
          </Link>
          <div className="my-2 md:my-0 md:mx-2">
            <div className="h-px w-px h-4 bg-light-black"></div>
          </div>
          <Link
            className="hover:text-dark-blue focus:outline-none focus:text-dark-blue"
            to="/privacy-policy"
          >
            Privacy Policy
          </Link>
        </div>
      </nav>
      <div className="py-4 bg-dark-blue w-full">
        <div className="max-w-screen-3xl mx-auto text-center text-white">
          © 2025 PGL Resources, LLC. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
