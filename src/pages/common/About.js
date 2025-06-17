import React from "react";
import { useSelector } from "react-redux";

const About = () => {
const {isLoggedIn} = useSelector(state=>state.auth);
  return (
    <>
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 xl:px-2 h-full">
        <div className={`${isLoggedIn ? "sm:rounded-tl-[20px] rounded-bl-[20px] rounded-br-[20px]" : "rounded-[20px]"} bg-white p-4 xl:p-8 h-full`}>
          <div className="flex flex-wrap w-full text-black overflow-auto">
            <h1 className="text-2xl mb-4 font-semibold">About ZillionLinX</h1>
            <p className="text-md mb-6 !leading-[28px]">
              <span className="font-semibold">ZillionLinX</span> was originally conceived in 2017 as a smarter, simpler
              way to save and share useful links. Although the original project
              was paused, the demand never stopped. After hearing from so many
              users who missed the old ZillionLinX, we decided it was time to
              bring it back—better than ever.
              </p>
              <p className="text-md mb-6 !leading-[28px]">
               The new ZillionLinX is built
              around <span className="font-semibold">Google Custom Search</span> and a growing library of
              <span className="font-semibold">pre-populated, curated link lists</span> to help you with everyday life.
              Whether you're planning a birthday party, preparing for finals,
              buying or selling a home or car, or dealing with a major life
              event in the family—we’ve got focused, relevant bookmarks that
              actually help.
              </p>
              <p className="text-md mb-6 !leading-[28px]">
               Unlike major search engines that flood you with
              thousands of results (mostly ranked by who's paying the most for
              your attention), ZillionLinX gives you a <span className="font-semibold">clean, structured
              experience</span> with just the links you need—and none you don’t.
            </p>
            <h2 className="mb-2">But the real magic?</h2>
            <p className="text-md mb-6 !leading-[28px]">
              ZillionLinX is <span className="font-semibold">super easy to use.</span> No confusing "label systems," no
              clunky drag-and-drop interfaces, and no rocket science required.
              We’ve seen what other social bookmarking tools are like (feel free
              to Google them), and trust us: they make organizing bookmarks a
              chore. You'll be back. 
              </p>
              <p className="text-md !leading-[20px]4mb28">
              So go ahead — <span className="font-semibold">step inside and check us out.</span>
              Whether you're a student, planner, parent, or just someone trying
              to get things done, <span className="font-semibold">ZillionLinX is your smart shortcut to a more
              organized web.</span>
            </p>
            <p className="text-md !leading-[20px] mt-2">ZillionLinX — Search smarter. Bookmark better.</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default About;
