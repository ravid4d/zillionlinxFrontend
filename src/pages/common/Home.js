import React, { useEffect, useState } from "react";
import badgeData from "../../json/badges.json";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Home = () => {
  const [badges, setBadges] = useState();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    setBadges(badgeData);
  }, []);

  let loginMessage = location?.state?.loginMessage
    ? location?.state?.loginMessage
    : "";

  useEffect(() => {
    if (loginMessage) {
      toast.success(loginMessage);
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [loginMessage]);

  return (
    <>
      <div className="relative overflow-hidden max-w-screen-3xl mx-auto">
        <div className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-20">
          <div className="text-center">
            <h1 className="text-[4.5vw] leading-[5.1vw] font-medium uppercase text-dark-blue">
              Find <span className="font-light">&</span> Bookmark <br />
              the good stuff
            </h1>

            <p className="text-[18px] text-gray-600 max-w-xl mx-auto mb-16 mt-10">
              Online Bookmarks, Online Favorites. Store and organize your
              Bookmarks in one place. Access your Bookmarks from every computer.
              Search the Internet and get real answers.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 mx-auto max-w-md md:max-w-xl 2xl:max-w-3xl gap-6 p-6 lg:p-0 items-center mb-10">
              {/* Second Column (Single Large Image) */}
              <div className="lg:row-span-2">
                <img
                  src="/zillionlinx/homepage.jpg"
                  className="shadow-home-bookmark border border-dark-blue/30 rounded-xl w-full"
                  alt="Middle Large"
                />
              </div>
              <div className="lg:row-span-2">
                <img
                  src="/zillionlinx/bookmark-1.jpg"
                  className="shadow-home-bookmark border border-dark-blue/30 rounded-xl w-full"
                  alt="Middle Large"
                />
              </div>
            </div>

            <div className="space-y-4 md:space-x-4">
              {badges &&
                badges?.length > 0 &&
                badges?.map((badge, index) => {
                  return (
                    <button className="btn badge-btn" key={index}>
                      {badge}
                    </button>
                  );
                })}
            </div>
          </div>
        </div>
      </div>
      <div className="hidden grid grid-cols-1 lg:grid-cols-3 gap-6 p-6 lg:p-0 items-center">
        {/* First Column */}
        <div className="grid lg:grid-rows-2 gap-6 3xl:gap-10 lg:grid-flow-col">
          <div className="lg:row-span-1 grid grid-cols-1 lg:grid-cols-5 gap-4">
            <div className="col-span-3 lg:col-start-2 lg:col-end-6 lg:pe-10 items">
              <img
                src="/zillionlinx/l-t-placeholder.jpg"
                className="shadow-home-bookmark w-full border border-dark-blue/30 rounded-xl lg:rounded-[20px]"
                alt="Large"
              />
            </div>
          </div>
          {/* Two Small Images */}
          <div className="lg:row-span-1 grid grid-cols-1 lg:grid-cols-5 gap-6 3xl:gap-10">
            <div className="lg:col-span-2">
              <img
                src="/zillionlinx/l-c-placeholder.jpg"
                className="shadow-home-bookmark w-full border border-dark-blue/30 rounded-xl lg:rounded-[20px]"
                alt="Small 1"
              />
            </div>
            <div className="lg:col-span-3">
              <img
                src="/zillionlinx/l-b-placeholder.jpg"
                className="shadow-home-bookmark w-full border border-dark-blue/30 rounded-xl lg:rounded-[20px]"
                alt="Small 2"
              />
            </div>
          </div>
        </div>

        {/* Second Column (Single Large Image) */}
        <div className="lg:row-span-2">
          <img
            src="/zillionlinx/center-placeholder.jpg"
            className="shadow-home-bookmark border border-dark-blue/30 rounded-xl lg:rounded-[20px] w-full"
            alt="Middle Large"
          />
        </div>

        <div className="grid lg:grid-rows-2 gap-6 3xl:gap-10 lg:grid-flow-col">
          {/* Two Small Images */}
          <div className="lg:row-span-1 grid grid-cols-1 lg:grid-cols-5 gap-6 3xl:gap-10 lg:items-end items-center">
            <div className="lg:col-span-3">
              <img
                src="/zillionlinx/r-t-placeholder.jpg"
                className="shadow-home-bookmark w-full border border-dark-blue/30 rounded-xl lg:rounded-[20px]"
                alt="Small 2"
              />
            </div>
            <div className="lg:col-span-2">
              <img
                src="/zillionlinx/r-c-placeholder.jpg"
                className="shadow-home-bookmark w-full border border-dark-blue/30 rounded-xl lg:rounded-[20px]"
                alt="Small 1"
              />
            </div>
          </div>
          <div className="lg:row-span-1 grid lg:grid-cols-5 gap-4">
            <div className="col-start-1 col-end-5 lg:ps-10">
              <img
                src="/zillionlinx/r-b-placeholder.jpg"
                className="shadow-home-bookmark w-full border border-dark-blue/30 rounded-xl lg:rounded-[20px]"
                alt="Large"
              />
            </div>
          </div>
        </div>
      </div>
     
    </>
  );
};

export default Home;
