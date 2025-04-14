import React from "react";
import { useSelector } from "react-redux";

const About = () => {
const {isLoggedIn} = useSelector(state=>state.auth);
  return (
    <>
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 xl:px-2 h-full">
        <div className={`${isLoggedIn ? "sm:rounded-tl-[20px] rounded-bl-[20px] rounded-br-[20px]" : "rounded-[20px]"} bg-white p-4 xl:p-8 h-full`}>
          <div className="flex flex-wrap h-full w-full text-black flex-col">
            <h1 className="text-2xl mb-4 font-bold">About ZillionLinX</h1>
            <p className="text-md mb-6 !leading-[28px]">
              <strong>ZillionLinX</strong> was originally conceived in 2017 as a smarter, simpler
              way to save and share useful links. Although the original project
              was paused, the demand never stopped. After hearing from so many
              users who missed the old ZillionLinX, we decided it was time to
              bring it back—better than ever.
              </p>
              <p className="text-md mb-6 !leading-[28px]">
               The new ZillionLinX is built
              around <strong>Google Custom Search</strong> and a growing library of
              <strong>pre-populated, curated link lists</strong> to help you with everyday life.
              Whether you're planning a birthday party, preparing for finals,
              buying or selling a home or car, or dealing with a major life
              event in the family—we’ve got focused, relevant bookmarks that
              actually help.
              </p>
              <p className="text-md mb-6 !leading-[28px]">
               Unlike major search engines that flood you with
              thousands of results (mostly ranked by who's paying the most for
              your attention), ZillionLinX gives you a <strong>clean, structured
              experience</strong> with just the links you need—and none you don’t.
            </p>
            <h2 className="mb-2">But the real magic?</h2>
            <p className="text-md mb-6 !leading-[28px]">
              ZillionLinX is <strong>super easy to use.</strong> No confusing "label systems," no
              clunky drag-and-drop interfaces, and no rocket science required.
              We’ve seen what other social bookmarking tools are like (feel free
              to Google them), and trust us: they make organizing bookmarks a
              chore. You'll be back. 
              </p>
              <p className="text-md !leading-[20px]4mb28">
              So go ahead — <strong>step inside and check us out.</strong>
              Whether you're a student, planner, parent, or just someone trying
              to get things done, <strong>ZillionLinX is your smart shortcut to a more
              organized web.</strong>
            </p>
            <p className="text-md !leading-[20px]">28llionL4nX — Search smarter. Bookmark better.</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default About;
