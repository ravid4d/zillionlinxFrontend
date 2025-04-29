import { useFormik } from "formik";
import React, { useEffect } from "react";
import * as YUP from "yup";
import { useLocation, useNavigate } from "react-router-dom";

const GoogleSearchbar = ({googleRef}) => {
  const navigate = useNavigate();
  const location = useLocation();
 
console.log(googleRef?.current?.value, 'baby')
const handleFocus = () => {
  if(googleRef?.current) {
      googleRef.current.style.backgroundImage = "url('')";
  }
}
const handleBlur = () => {
  if(googleRef?.current) {
    if(googleRef.current.value !== "") {
      googleRef.current.style.backgroundImage = "url('')";
    }
    else {
      googleRef.current.style.backgroundImage = `url("/branding.png")`;
    }
  }
}

useEffect(()=>{
  handleBlur();
},[googleRef?.current?.value]);

  const googleFormik = useFormik({
    initialValues: {
      title: new URLSearchParams(location.search).get("query") || "" // Preserve query param on reload
    },
    validationSchema: YUP.object({
      title: YUP.string().required("Search query is required")
    }),
    onSubmit: async (values) => {
      let formData = new FormData();
      formData.append("title", values?.title);

      if (!values.title.trim()) return; // Prevent empty search

      // Update URL with query params
      const queryParam = `?query=${encodeURIComponent(values.title)}`;

      if (location.pathname !== "/result") {
        navigate(`/result${queryParam}`); // Redirect to /result with query param
      } else {
        navigate(`/result${queryParam}`, { replace: true }); // Only update query param in URL
      }
    }
  });
  return (
    <form
      onSubmit={googleFormik.handleSubmit}
      className={`flex items-center justify-end gap-4 mb-4 relative  ${
        location.pathname === "/bookmarks"
          ? "max-w-full xl:w-[calc(100%-375px)]"
          : "w-full md:w-[calc(50%-25px)]"
      } `}
    >
      {/* <span className="absolute left-3 top-0 bottom-0 my-auto flex items-center">
                <img src="/google-searchbar-icon.svg" alt="" />
            </span> */}
      <div className="px-3 bg-white border border-gray-200">
        <input
          type="text"
          value={googleFormik.values?.title}
          onChange={googleFormik.handleChange}
          // placeholder='Search the web'
          id="searchTitle"
          name="title"
          ref={googleRef}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className="google-search py-1 px-0 block w-full border-0 focus:z-10 focus:border-0 focus:ring-0 disabled:opacity-50 disabled:pointer-events-none placeholder:text-lg placeholder:text-light-black/48"
        />
      </div>
      <button
        type="subimit"
        className="w-[70px] h-8 shrink-0 inline-flex justify-center items-center gap-x-2 text-md font-semibold border-2 border-[#3079ed] bg-[#4d90fe] text-white hover:bg-[#3079ed] focus:outline-none focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
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
          <circle cx="11" cy="11" r="8"></circle>
          <path d="m21 21-4.3-4.3"></path>
        </svg>
      </button>
    </form>
  );
};

export default GoogleSearchbar;
