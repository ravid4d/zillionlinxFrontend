import React, { useEffect, useRef, useState } from "react";
import Textfield from "../elements/Textfield";
import { useFormik } from "formik";
import * as YUP from "yup";
import { toast } from "react-toastify";
// import Dropdown from "../elements/Dropdown";
import { useDispatch, useSelector } from "react-redux";
import {
  addNewBookmark,
  fetchAllTopLinks,
  fetchCategoryWiseBookmarks
} from "../../redux/slices/bookmarkSlice";
import {
  fetchCategories,
  fetchSubCategories,
  resetSubCategories
} from "../../redux/slices/categorySlice";
import { Link, useLocation } from "react-router-dom";
import useClickAway from "../../services/useClickAway";

const AddNewBookmark = ({ urlToBookmark, openModal, closeAllModals, id }) => {
  const dispatch = useDispatch();
  const location = useLocation();

  const [resetKey, setResetKey] = useState(0);
  const [selectedCategoryId, setSelectedCategoryId] = useState(undefined);
  const [selectedSubCategoryId, setSelectedSubCategoryId] = useState(undefined);
  const [showNewSubCategory, setShowNewSubCategory] = useState(undefined);

  const { token } = useSelector((state) => state.auth);
  const { categories, subCategories } = useSelector((state) => state.category);
  const { loading } = useSelector((state) => state.bookmark);
  const [isCategoryDropdownOpen, setCategoryDropdown] = useState(false);

  const controllerRef = useRef(null);
  const categoryRef = useRef(null);

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
      url: YUP.string()
  .required("URL is required")
  .test("is-valid-url", "Invalid URL format", (value) => {
    if (!value) return false;
    try {
      // Add https:// back before validation
      new URL("https://" + value);
      return true;
    } catch (err) {
      return false;
    }
  }),
      category_id: YUP.number()
        .required("Category Id is required")
        .typeError("Category Id must be a number"),
      sub_category_id: YUP.number().typeError(
        "Sub Category Id must be a number"
      ),
      // sub_category_name: YUP.string().when("sub_category_id", {
      //   is: () => showNewSubCategory !== undefined && showNewSubCategory!=='remove',
      //   then: (schema) => schema.required("New Sub Category Name is required"),
      //   otherwise: (schema) => schema.notRequired()
      // }),
      add_to: YUP.string().required("Add To is required")
    }),
    validate: (values) => {
      const errors = {};
      if (showNewSubCategory === "remove" && !values.sub_category_name) {
        errors.sub_category_name = "hola dear is required";
      }
      return errors;
    },
    onSubmit: (values) => {
      const updatedValues = {
        ...values,
        url: `https://${values.url}`,
        ...(showNewSubCategory !== undefined && showNewSubCategory === "remove"
          ? {}
          : { sub_category_name: "" }) // Remove sub_category_name if not needed
      };
      handleAddNewBookmark(updatedValues);
    }
  });

  const handleAddNewBookmark = async (values) => {
    controllerRef.current = new AbortController();
    const result = await dispatch(
      addNewBookmark({ values, token, controller: controllerRef?.current })
    );
    if (addNewBookmark.fulfilled.match(result)) {
      toast.success(result.payload.message || "Bookmark added successfully!");
      let categoryId = result?.payload?.category_id;
      let subCategoryId = result?.payload?.sub_category_id;

      if (location?.pathname === "/bookmarks") {
        if (result?.payload?.add_to === "bookmark") {
          await dispatch(
            fetchCategoryWiseBookmarks({ token, categoryId, subCategoryId })
          );
        }
        if (result?.payload?.add_to === "top_link") {
          await dispatch(fetchAllTopLinks(token));
        }
      } else {
        // navigate("/bookmarks", {
        //   state: {
          //     categoryId: result?.payload?.category_id,
        //     subCategoryId: result?.payload?.sub_category_id,
        //     addTo: result?.payload?.addto
        //   }
        // });
      }
      await dispatch(fetchCategories(token));
      
      closeModal();
      setShowNewSubCategory(false);
    } else {
      toast.error(result.payload?.message || "Failed to add bookmark.");
    }
  };
  
  const closeModal = () => {
    formik.resetForm();
    closeAllModals();
  };
  
  const handleCancel = () => {
    controllerRef.current?.abort(); // Cancels the request
    closeModal();
  };
  
  useEffect(() => {
    if (urlToBookmark?.link) {
      formik.setFieldValue("url", urlToBookmark?.link);
    }
  }, [urlToBookmark?.link]);

  useEffect(() => {
    let record =
    typeof urlToBookmark === "object" &&
    urlToBookmark !== null &&
    !Array.isArray(urlToBookmark)
        ? urlToBookmark?.record
        : urlToBookmark;
    if (record) {
      let value = record?.link;
      if (value.startsWith("https://")) {
        value = value.replace("https://", ""); // Remove https://
      }
      formik.setFieldValue("url", value);

      // formik.setFieldValue("url", record?.link);
      formik.setFieldValue("title", record?.title);
      formik.setFieldValue("add_to", record?.type);
    }
  }, [urlToBookmark?.record?.title]);

  // useClickAway(categoryRef, isCategoryDropdownOpen, () => {
  //   setCategoryDropdown(false);
  // });
  
  useEffect(() => {
    if (
      selectedCategoryId === undefined &&
      selectedSubCategoryId === undefined
    ) {
      setShowNewSubCategory(undefined);
    } else if (
      selectedCategoryId !== undefined &&
      selectedSubCategoryId === undefined
    ) {
      setShowNewSubCategory(true);
    } else {
      setShowNewSubCategory(undefined);
    }
  }, [selectedCategoryId, selectedSubCategoryId]);
  
  useEffect(() => {
    if (showNewSubCategory === "remove") {
      formik.setFieldError(
        "sub_category_name",
        "Sub Category Name is required"
      );
    } else {
      formik.setFieldError("sub_category_name", "");
    }
  }, [showNewSubCategory]);

  const handleChange = (e) => {
    let value = e.target.value;
    if (value.startsWith("https://")) {
      value = value.replace("https://", ""); // Remove https://
    }
    formik.setFieldValue("url", value);
  };
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
                    loading.addNewBookmark
                      ? "disabled:bg-light-blue disabled:text-dark-blue disabled:pointer-events-none"
                      : ""
                  } absolute top-5 right-5 size-9 inline-flex justify-center items-center rounded-full border border-transparent bg-dark-blue text-light-blue hover:bg-light-blue hover:text-dark-blue focus:outline-none focus:bg-light-blue focus:text-dark-blue disabled:opacity-50 disabled:pointer-events-none`}
                  disabled={loading.addNewBookmark}
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
                      autoFocus={true}
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
                    <label
                      htmlFor="url"
                      className="block text-base text-light-black mb-3"
                    >
                      Website
                    </label>
                    <div className="relative w-full">
                      <input
                        type="text"
                        value={formik.values.url}
                        onChange={handleChange}
                        onBlur={formik.handleBlur}
                        placeholder=""
                        id="url"
                        name="url"
                        className="py-3 px-4 bg-transparent border-dark-blue focus:border-blue-500 focus:ring-blue-500 ps-[66px] h-12 block  w-full rounded-lg text-md"
                      />
                      <div className="absolute inset-y-0 start-0 text-gray-600 flex items-center pointer-events-none ps-4 peer-disabled:opacity-50 peer-disabled:pointer-events-none">
                        https://
                      </div>
                    </div>
                    {formik.touched.url && formik.errors.url ? (
                      <div className="text-red-500 text-sm mt-1">
                        {formik.errors.url}
                      </div>
                    ) : null}
                  </div>
                  {categories ? (
                    <>
                      <div className="mb-5">
                        <div className="relative flex flex-col">
                          <label
                            htmlFor=""
                            className="block text-base text-light-black mb-3"
                          >
                            Category / Sub Category
                            {showNewSubCategory &&
                              showNewSubCategory !== undefined &&
                              showNewSubCategory !== "remove" && (
                                <span
                                  title="Add new sub category"
                                  className="capitalize absolute top-0.5 right-0 text-sm !leading-[24px] font-medium text-dark-blue cursor-pointer group"
                                  onClick={() =>
                                   { setCategoryDropdown(false);
                                    setShowNewSubCategory("remove")
                                   }
                                  }
                                >
                                  Add Sub Category
                                </span>
                              )}
                            {showNewSubCategory === "remove" &&
                              showNewSubCategory !== undefined && (
                                <div className="flex justify-end items-center">
                                  <span
                                    title="Don't add new sub category?"
                                    className="capitalize absolute top-0.5 right-0 text-sm !leading-[24px] font-medium text-dark-blue cursor-pointer group"
                                    onClick={() => setShowNewSubCategory(true)}
                                  >
                                    Remove Sub Category
                                  </span>
                                </div>
                              )}
                          </label>
                          <button
                            onClick={() =>
                              setCategoryDropdown(!isCategoryDropdownOpen)
                            }
                            type="button"
                            className="w-full py-3 px-4 inline-flex items-center justify-between gap-x-2 text-md rounded-lg border border-dark-blue bg-transparent text-gray-800 shadow-2xs focus:outline-hidden"
                          >
                            {selectedCategoryId
                              ? `${selectedCategoryId} ${
                                  selectedSubCategoryId
                                    ? `| ${selectedSubCategoryId}`
                                    : ""
                                }`
                              : "Select an option"}
                            <svg
                              className="hs-dropdown-open:rotate-180 size-4"
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
                              <path d="m6 9 6 6 6-6" />
                            </svg>
                          </button>

                          <div
                            // ref={categoryRef}
                            className={`transition-[opacity,margin] duration ${
                              isCategoryDropdownOpen
                                ? "opacity-100 visible"
                                : "opacity-0 hidden"
                            }  min-w-60 bg-lighter-blue shadow-md rounded-lg mt-2`}
                          >
                            <div className="p-1 space-y-0.5">
                              {categories &&
                                categories?.length > 0 &&
                                categories?.map((category) => {
                                  return (
                                    <div
                                      className="cursor-pointer flex relative group items-center gap-x-3.5 py-2 px-3 rounded-lg text-md text-gray-800 hover:bg-white focus:outline-hidden focus:bg-gray-100"
                                      key={category?.id}
                                      onClick={() => {
                                        formik.setFieldValue(
                                          "category_id",
                                          category?.id
                                        );
                                        setSelectedCategoryId(category?.title);
                                        setSelectedSubCategoryId(undefined);
                                      }}
                                    >
                                      {category?.title}
                                      <div className="p-1 space-y-0.5 absolute invisible opacity-0 group-hover:opacity-100 group-hover:visible top-[-4px] w-1/2 rounded-lg bg-lighter-blue start-[150px] sm:start-[200px] md:start-full overflow-auto height-full">
                                        {category?.subcategories &&
                                          category?.subcategories?.length > 0 &&
                                          category?.subcategories?.map(
                                            (subCategory) => {
                                              return (
                                                <div
                                                  key={subCategory?.id}
                                                  onClick={(event) => {
                                                    event.stopPropagation();
                                                    formik.setFieldValue(
                                                      "category_id",
                                                      category?.id
                                                    );
                                                    setSelectedCategoryId(
                                                      category?.title
                                                    );
                                                    formik.setFieldValue(
                                                      "sub_category_id",
                                                      subCategory?.id
                                                    );
                                                    setSelectedSubCategoryId(
                                                      subCategory?.title
                                                    );
                                                    setCategoryDropdown(false)
                                                  }}
                                                  className="cursor-pointer flex relative group items-center gap-x-3.5 py-2 px-3 rounded-lg text-md text-gray-800 hover:bg-white focus:outline-hidden focus:bg-gray-100"
                                                >
                                                  {subCategory?.title}
                                                </div>
                                              );
                                            }
                                          )}
                                      </div>
                                    </div>
                                  );
                                })}
                            </div>
                          </div>
                          {formik.touched.category_id &&
                          formik.errors.category_id ? (
                            <div className="text-red-500 text-sm mt-1">
                              {formik.errors.category_id}
                            </div>
                          ) : null}
                        </div>
                        {/* <Dropdown
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
                          formik={formik}
                          items={categories}
                        /> */}
                        {/* {formik.touched.category_id &&
                        formik.errors.category_id ? (
                          <div className="text-red-500 text-sm mt-1">
                            {formik.errors.category_id}
                          </div>
                        ) : null} */}
                      </div>
                    </>
                  ) : null}

                  {/* {!showNewSubCategory && (
                    <div className="mb-5 relative">
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
                        formik={formik}
                        items={subCategories}
                      />

                      {formik.touched.sub_category_id &&
                      formik.errors.sub_category_id ? (
                        <div className="text-red-500 text-sm mt-1">
                          {formik.errors.sub_category_id}
                        </div>
                      ) : null}
                    </div>
                  )} */}

                  {showNewSubCategory &&
                    showNewSubCategory !== undefined &&
                    showNewSubCategory === "remove" && (
                      <div className="mb-5 relative">
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
                        {formik.touched.sub_category_name &&
                        formik.errors?.sub_category_name ? (
                          <div className="text-red-500 text-sm mt-1">
                            {formik.errors.sub_category_name}
                          </div>
                        ) : null}
                      </div>
                    )}

                  {/* <div className="mb-5">
              <button className="btn dark-btn justify-center h-12 " type="button" onClick={() => setShowNewSubCategory(true)}>
              <span className="capitalize"> + New Sub Category</span>
              </button>
              </div> */}
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
                    disabled={loading?.addNewBookmark}
                    className={`btn dark-btn w-full justify-center h-12 ${
                      loading?.addNewBookmark
                        ? "disabled:bg-light-blue disabled:text-dark-blue disabled:pointer-events-none"
                        : ""
                    }`}
                  >
                    {loading?.addNewBookmark ? (
                      <span className="loader"></span>
                    ) : (
                      "Add New Bookmark"
                    )}
                  </button>
                  {loading?.addNewBookmark && (
                    <>
                      <button
                        className={`text-gray-900 hover:underline inline-block d-flex w-full justify-center h-12 mt-2`}
                        type="button"
                        onClick={handleCancel}
                      >
                        Cancel
                      </button>
                      <div className="mt-2">
                        <p className="text-gray-700 text-sm text-center">
                          Please be patient for about 5 seconds while we are
                          generating a high quality screenshot. Thank you!
                        </p>
                      </div>
                    </>
                  )}
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
