import { useFormik } from 'formik';
import React from 'react'
import * as YUP from 'yup';
import { useLocation, useNavigate } from 'react-router-dom';

const GoogleSearchbar = () => {
    const navigate = useNavigate();
    const location = useLocation(); 

    const googleFormik = useFormik({
        initialValues: {
          title: new URLSearchParams(location.search).get("query") || "", // Preserve query param on reload
        },
        validationSchema: YUP.object({
          title: YUP.string().required("Search query is required"),
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
        },
      });
    return (
        <form onSubmit={googleFormik.handleSubmit} className={`flex items-center rounded-xl shadow-sm mb-4 relative pl-32 bg-white border border-gray-200 ${location.pathname === "/bookmarks" ? "max-w-full xl:w-[calc(100%-375px)]" : "w-full md:w-[calc(50%-25px)]"} `}>
            <span className="absolute left-3 top-0 bottom-0 my-auto flex items-center">
                <img src="/google-searchbar-icon.svg" alt="" />
            </span>

            <input type="text" value={googleFormik.values?.title} onChange={googleFormik.handleChange} placeholder='Search the web' id="title" name="title" className="h-[48px] py-3 pl-4 pr-14 block w-full border-0 rounded-xl text-sm placeholder:text-lg placeholder:text-light-black/48 focus:z-10 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none" />
            <button type="subimit" className="absolute z-20 right-2 top-1 w-[40px] h-[40px] shrink-0 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-xl border border-transparent bg-dark-blue text-white hover:bg-blue-700 focus:outline-none focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none">
                <svg className="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8"></circle>
                    <path d="m21 21-4.3-4.3"></path>
                </svg>
            </button>
        </form>
    )
}

export default GoogleSearchbar