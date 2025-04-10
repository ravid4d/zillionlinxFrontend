import React from "react";
import { Link } from "react-router-dom";

const GoodBye = () => {
  return (
    <div className="max-w-3xl flex flex-wrap items-center justify-center h-screen mx-auto size-full">
      <main id="content">
        <div className="text-center py-10 px-4 sm:px-6 lg:px-8">
          <h1 className="block text-7xl font-bold text-gray-800 sm:text-9xl dark:text-white">
           GOOD BYE
          </h1>
          <p className="mt-3 text-gray-600 dark:text-neutral-400 mb-3">
            We’re sad to see you go, but we respect your decision.
          </p>
          <p className="text-gray-600 dark:text-neutral-400 mb-3">
            Thank you for being a part of our journey. Whether you were with us
            for a short while or a long time, your presence meant a lot. Your
            account has been successfully deleted, and all your data has been
            removed from our systems.
          </p>
          <p className="text-gray-600 dark:text-neutral-400 mb-3">
            If you ever change your mind, we’ll be right here — ready to welcome
            you back with open arms.
          </p>
          <p className="text-gray-600 dark:text-neutral-400">
            Until then, take care and all the best on your next adventure! 💙
          </p>
          <div className="mt-10 flex flex-col justify-center items-center gap-2 sm:flex-row sm:gap-3">
            <Link
              className="w-full sm:w-auto py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-hidden focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
              to="/"
            >
              <svg
                className="shrink-0 size-4"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m15 18-6-6 6-6" />
              </svg>
              Back to Home
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default GoodBye;
