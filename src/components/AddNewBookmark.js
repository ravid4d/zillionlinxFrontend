import React, { useEffect, useState } from "react";
import Textfield from "./Textfield";
import { useFormik } from "formik";
import * as YUP from "yup";
import { toast } from "react-toastify";
import Dropdown from "../components/Dropdown";
import { useDispatch, useSelector } from "react-redux";
import {
  addNewBookmark,
  fetchAllTopLinks,
  fetchCategoryWiseBookmarks
} from "../redux/slices/bookmarkSlice";
import {
  fetchCategories,
  fetchSubCategories,
  resetSubCategories
} from "../redux/slices/categorySlice";
import { useLocation, useNavigate} from "react-router-dom";

const AddNewBookmark = ({ urlToBookmark, openModal, closeAllModals, id }) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const [resetKey, setResetKey] = useState(0);
  const [selectedCategoryId, setSelectedCategoryId] = useState([]);
  const [showNewSubCategory, setShowNewSubCategory] = useState(false);

  const { token } = useSelector((state) => state.auth);
  const { categories, subCategories } = useSelector((state) => state.category);
  const { addBookmarkLoading } = useSelector((state) => state.bookmark);

  useEffect(() => {
    const fetchData = async () => {
      let result = await dispatch(fetchCategories(token));
      if (fetchCategories.fulfilled.match(result)) {
        //Do not need to show success message using toast while getting data on load
        // toast.success(result.payload.message || "Categories fetched successfully!")
      } else {
        toast.error(result.payload || "Failed to fetch categories!");
      }
    };
    if (token) {
      fetchData();
    }
  }, [dispatch, token]);

  useEffect(() => {
    if (token && selectedCategoryId) {
      dispatch(resetSubCategories());
      setResetKey((prev) => prev + 1);
      dispatch(fetchSubCategories({ selectedCategoryId, token }));
    }
  }, [dispatch, selectedCategoryId, token]);

  const formik = useFormik({
    initialValues: {
      title: "",
      url: "",
      category_id: "",
      sub_category_id: "",
      sub_category_name: "",
      add_to: ""
    },
    validationSchema: YUP.object({
      title: YUP.string()
        .required("Title is required")
        .min(3, "Must be at least 3 characters"),
      // .max(50, "Cannot exceed 50 characters"),
      url: YUP.string().url("Invalid URL format").required("URL is required"),
      category_id: YUP.number()
        .required("Category Id is required")
        .typeError("Category Id must be a number"),
      sub_category_id: YUP.number().typeError(
        "Sub Category Id must be a number"
      ),
      sub_category_name: YUP.string().when("sub_category_id", {
        is: () => showNewSubCategory,
        then: (schema) => schema.required("New Sub Category Name is required"),
        otherwise: (schema) => schema.notRequired(),
      }),
      add_to: YUP.string().required("Add To is required")
    }),
    onSubmit: (values) => { 
      const updatedValues = {
        ...values,
        ...(showNewSubCategory ? {} : { sub_category_name: "" }), // Remove sub_category_name if not needed
      };
      handleAddNewBookmark(updatedValues);
    }
  });

  const handleAddNewBookmark = async (values) => {
    const result = await dispatch(addNewBookmark({ values, token }));
    if (addNewBookmark.fulfilled.match(result)) {
      toast.success(result.payload.message || "Bookmark added successfully!");
      let categoryId = result?.payload?.category_id;
      let subCategoryId = result?.payload?.sub_category_id;
      
      if(location?.pathname === "/bookmarks") {
        if(result?.payload?.add_to === "bookmark") {
          await dispatch(fetchCategoryWiseBookmarks({token, categoryId, subCategoryId}))
        }
        if(result?.payload?.add_to === "top_link") {
          await dispatch(fetchAllTopLinks(token));
        }
      }
      else {
        navigate("/bookmarks", {
          state: {
              categoryId: result?.payload?.category_id,
              subCategoryId: result?.payload?.sub_category_id,
              addTo: result?.payload?.addto
          }
      });
      }
      await dispatch(fetchCategories(token));

      closeModal();
      setShowNewSubCategory(false)
    } else {
      toast.error(result.payload?.message || "Failed to add bookmark.");
    }
  };

  const closeModal = () => {
    formik.resetForm();
    closeAllModals();
  };

  useEffect(()=>{
    if(urlToBookmark?.link) {
      formik.setFieldValue('url', urlToBookmark?.link);
    }
  },[urlToBookmark?.link]);

  useEffect(() => {
    let record =
      typeof urlToBookmark === "object" &&
      urlToBookmark !== null &&
      !Array.isArray(urlToBookmark)
        ? urlToBookmark?.record
        : urlToBookmark;
    if (record) {
      formik.setFieldValue("url", record?.link);
      formik.setFieldValue("title", record?.title);
      formik.setFieldValue("add_to", record?.type);
    }
  }, [urlToBookmark?.record?.title]);

  return (
    <>
      {/* {urlToBookmark?.link} */}
      <div
        id="add-new-bookmark-modal"
        className={`hs-overlay ${
          openModal?.newBookmark ? "open opened" : "hidden"
        } size-full fixed top-0 start-0 z-[80] overflow-x-hidden overflow-y-auto pointer-events-none`}
        role="dialog"
        tabIndex="-1"
        aria-labelledby="add-new-bookmark-modal-label"
      >
        <div className="hs-overlay-animation-target hs-overlay-open:mt-7 hs-overlay-open:opacity-100 hs-overlay-open:duration-500 mt-0 opacity-0 ease-out transition-all max-w-xl xl:max-w-[600px] md:w-full m-6 sm:mx-auto min-h-[calc(100%-3.5rem)] flex items-center">
          <div className="flex flex-col bg-pattern bg-no-repeat bg-cover bg-center border shadow-sm rounded-[30px] pointer-events-auto w-full relative">
            <div className="w-full py-20 px-10">
              <div className="flex justify-between items-center flex-col max-w-[400px] mx-auto">
                <h3
                  id="add-new-bookmark-modal-label"
                  className="uppercase text-dark-blue text-center w-full text-3xl xl:text-5xl mb-6"
                >
                  Add Bookmark
                </h3>
                <button
                  type="button"
                  onClick={closeModal}
                  className={`${
                    addBookmarkLoading
                      ? "disabled:bg-light-blue disabled:text-dark-blue disabled:pointer-events-none"
                      : ""
                  } absolute top-5 right-5 size-9 inline-flex justify-center items-center rounded-full border border-transparent bg-dark-blue text-light-blue hover:bg-light-blue hover:text-dark-blue focus:outline-none focus:bg-light-blue focus:text-dark-blue disabled:opacity-50 disabled:pointer-events-none`}
                  disabled={addBookmarkLoading}
                  aria-label="Close"
                  data-hs-overlay="#hs-slide-down-animation-modal"
                >
                  <span className="sr-only">Close</span>
                  <svg
                    className="shrink-0 size-5"
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
                    <path d="M18 6 6 18"></path>
                    <path d="m6 6 12 12"></path>
                  </svg>
                </button>
              </div>
              <div className="max-w-[400px] mx-auto">
                <form onSubmit={formik.handleSubmit}>
                  <div className="mb-5">
                    <Textfield
                      id="title"
                      name="title"
                      label="Title"
                      type="text"
                      placeholder=""
                      icon="title"
                      iconPlacement="left"
                      fieldValue={formik.values.title}
                      setFieldValue={formik.handleChange}
                      setFieldValueOnBlur={formik.handleBlur}
                    />
                    {formik.touched.title && formik.errors.title ? (
                      <div className="text-red-500 text-sm mt-1">
                        {formik.errors.title}
                      </div>
                    ) : null}
                  </div>
                  <div className="mb-5">
                    <Textfield
                      id="url"
                      name="url"
                      label="Website"
                      type="url"
                      placeholder=""
                      icon="url"
                      iconPlacement="left"
                      fieldValue={formik.values.url}
                      setFieldValue={formik.handleChange}
                      setFieldValueOnBlur={formik.handleBlur}
                    />
                    {formik.touched.url && formik.errors.url ? (
                      <div className="text-red-500 text-sm mt-1">
                        {formik.errors.url}
                      </div>
                    ) : null}
                  </div>
                  {categories ? (
                    <>
                      <div className="mb-5">
                        <Dropdown
                          id="category_id"
                          name="category_id"
                          label="Category"
                          fieldValue={formik.values.category_id}
                          setFieldValue={(selectedOption) => {
                            formik.setFieldValue(
                              "category_id",
                              selectedOption?.value
                            );
                            setSelectedCategoryId(selectedOption?.value);
                          }}
                          items={categories}
                        />
                        {formik.touched.category_id &&
                        formik.errors.category_id ? (
                          <div className="text-red-500 text-sm mt-1">
                            {formik.errors.category_id}
                          </div>
                        ) : null}
                        {/* <p>{categories?.length==0&&'Server Issue'}</p> */}
                      </div>
                    </>
                  ) : null}
                  
                  {!showNewSubCategory && (
                    <div className="mb-5">
                      <Dropdown
                        key={resetKey}
                        id="sub_category_id"
                        name="sub_category_id"
                        label="Sub Category"
                        fieldValue={formik.values.sub_category_id}
                        setFieldValue={(selectedOption) =>
                          formik.setFieldValue(
                            "sub_category_id",
                            selectedOption?.value
                          )
                        }
                        items={subCategories}
                      />
                      {formik.touched.sub_category_id &&
                      formik.errors.sub_category_id ? (
                        <div className="text-red-500 text-sm mt-1">
                          {formik.errors.sub_category_id}
                        </div>
                      ) : null}
                    </div>
                  )}

                  {showNewSubCategory && (
                    <div className="mb-5 relative">
                      <div className="flex justify-end items-center">
                        <button type="button"
                          class="absolute top-0 size-6 inline-flex justify-center items-center rounded-full border border-transparent bg-dark-blue text-light-blue hover:bg-light-blue hover:text-dark-blue focus:outline-none focus:bg-light-blue focus:text-dark-blue disabled:opacity-50 disabled:pointer-events-none"
                          aria-label="Close" data-hs-overlay="#hs-slide-down-animation-modal" aria-expanded="false" onClick={()=>setShowNewSubCategory(false)}>
                          <span class="sr-only">Close</span>
                          <svg class="shrink-0 size-5" xmlns="http://www.w3.org/2000/svg" width="24"
                            height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                            stroke-linejoin="round">
                            <path d="M18 6 6 18"></path>
                            <path d="m6 6 12 12"></path>
                          </svg>
                        </button>
                      </div>
                      <Textfield
                        id="sub_category_name"
                        name="sub_category_name"
                        label="New Sub Category"
                        type="text"
                        placeholder="New Sub Category"
                        fieldValue={formik.values.sub_category_name}
                        setFieldValue={formik.handleChange}
                        setFieldValueOnBlur={formik.handleBlur}
                      />
                      {formik.touched.url && formik.errors?.sub_category_name ? (
                        <div className="text-red-500 text-sm mt-1">
                          {formik.errors.sub_category_name}
                        </div>
                      ) : null}
                    </div>
                  )} 
                  
                  <div className="mb-5">
                    <button className="btn dark-btn justify-center h-12 " type="button" onClick={() => setShowNewSubCategory(true)}>
                     <span className="capitalize"> + New Sub Category</span>
                    </button>
                  </div>
                  <div className="mb-5">
                    <label
                      htmlFor="add_to"
                      className="block text-base text-light-black mb-3"
                    >
                      Add To?
                    </label>
                    <div className="flex gap-x-6">
                      <div className="flex">
                        <input
                          type="radio"
                          name="add_to"
                          value="bookmark"
                          checked={formik.values.add_to === "bookmark"}
                          onChange={formik.handleChange}
                          className="bg-transparent shrink-0 mt-0.5 border-dark-blue rounded-full text-blue-600 focus:ring-dark-blue disabled:opacity-50 disabled:pointer-events-none"
                          id="bookmark"
                        />
                        <label
                          htmlFor="bookmark"
                          className="text-base text-gray-500 ms-2"
                        >
                          Bookmark
                        </label>
                      </div>

                      <div className="flex">
                        <input
                          type="radio"
                          name="add_to"
                          checked={formik.values.add_to === "top_link"}
                          value="top_link"
                          onChange={formik.handleChange}
                          className="bg-transparent checked:bg-dark-blue shrink-0 mt-0.5 border-dark-blue rounded-full text-blue-600 focus:ring-dark-blue disabled:opacity-50 disabled:pointer-events-none"
                          id="top_links"
                        />
                        <label
                          htmlFor="top_links"
                          className="text-base text-gray-500 ms-2"
                        >
                          Top Links
                        </label>
                      </div>
                    </div>

                    {formik.touched.add_to && formik.errors.add_to ? (
                      <div className="text-red-500 text-sm mt-1">
                        {formik.errors.add_to}
                      </div>
                    ) : null}
                  </div>
                  <button
                    type="submit"
                    disabled={addBookmarkLoading}
                    className={`btn dark-btn w-full justify-center h-12 ${
                      addBookmarkLoading
                        ? "disabled:bg-light-blue disabled:text-dark-blue disabled:pointer-events-none"
                        : ""
                    }`}
                  >
                    {
                      addBookmarkLoading?<span className="loader"></span>:"Add New Bookmark"
                    }
                    
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddNewBookmark;
