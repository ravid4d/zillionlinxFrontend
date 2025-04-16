import { useFormik } from "formik";
import React from "react";
import { useLocation } from "react-router-dom";
import * as YUP from "yup";

const AddNewBookmarkField = ({ setWhichModalOpen, setUrlToBookmark }) => {
  const location = useLocation();
  const formik = useFormik({
    initialValues: {
      url: ""
    },
    validationSchema: YUP.object({
      url: YUP.string()
        .transform((value) => {
          if (value.startsWith("https://")) {
            return value.replace("https://", "");
          }
          return value;
        })
        .test("valid-url", "Invalid URL format", (value) => {
          return YUP.string().url().isValidSync(`https://${value}`);
        })
        .required("URL is required.")
    }),
    onSubmit: (values) => {
      const formattedUrl = `https://${values.url}`;
      setUrlToBookmark({ link: formattedUrl });
      addBookmarkViaUrl();
    }
  });

  //Open Add New Bookmark Modal
  const addBookmarkViaUrl = () => {
    setWhichModalOpen("newBookmark");
    let inputField = document.getElementById("url");
    inputField.blur();
    setTimeout(() => {
      formik.resetForm();
    }, 500);
  };

  const handleChange = (e) => {
    let value = e.target.value;
    if (value.startsWith("https://")) {
      value = value.replace("https://", ""); // Remove https://
    }
    formik.setFieldValue("url", value);
  };

  return (
    <form onSubmit={formik.handleSubmit} className={`${location.pathname === "/bookmarks" ? "w-full" : "w-1/2"}`}>
      <div className="flex items-center rounded-xl shadow-sm mb-4 relative add-url-to-bookmark xl:w-[350px] max-w-full">
        <div className="relative w-full">
          <input
            type="text"
            value={formik.values.url}
            onChange={handleChange}
            placeholder="Add an URL to Your Bookmarks"
            id="url"
            name="url"
            className="h-[48px] py-3 pl-[68px] pr-14 block w-full border-gray-200 rounded-xl text-md placeholder:text-lg placeholder:text-light-black/48 focus:z-10 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
          />
          <div className="absolute inset-y-0 start-0 text-gray-600 flex items-center pointer-events-none ps-4 peer-disabled:opacity-50 peer-disabled:pointer-events-none">
            https://
          </div>
        </div>
        {formik.touched.url && formik.errors.url ? (
          <div className="text-red-500 text-sm absolute -top-[20px] left-2">
            {formik.errors.url}
          </div>
        ) : null}
        <button
          type="submit"
          className="absolute z-20 right-2 top-1 w-[40px] h-[40px] inline-flex justify-center items-center border border-transparent bg-transparent hover:bg-transparent focus:outline-none focus:bg-transparent disabled:opacity-50 disabled:pointer-events-none"
        >
          <img src="/submit-icon.png" alt="" className="" />
        </button>
      </div>
    </form>
  );
};

export default AddNewBookmarkField;
