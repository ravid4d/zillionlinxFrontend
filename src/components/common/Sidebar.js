import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories } from "../../redux/slices/categorySlice";
import {
  linkFrontListing,
  setPageHeading,
  clearInstantLink,
  updateListingtype
} from "../../redux/slices/bookmarkSlice";

const Sidebar = ({ setId, id, setSearchResults, redirectTo }) => {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const { categories, loading } = useSelector((state) => state.category);
  const { bookmark_addto } = useSelector((state) => state.bookmark);
  const [openAccordion, setOpenAccordion] = useState({});

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

  const toggleAccordion = (id, hasDropdown) => {
    if (!hasDropdown) return;
    setOpenAccordion((prevId) => (prevId === id ? null : id));
  };

  useEffect(() => {
    if (id?.categoryId !== "" && bookmark_addto === "bookmark") {
      const selectedCategory = categories.find(
        (category) => category.id === id.categoryId
      );
      const hasDropdown = selectedCategory?.subcategories?.length > 0;
      toggleAccordion(`users-accordion_${id?.categoryId}`, hasDropdown);
    }
  }, [id?.categoryId, bookmark_addto]);

  return (
    <div className="rounded-2xl bg-white xl:py-0 min-h-[calc(100%-64px)] h-[calc(100%-64px)] relative">
      <div className="min-h-4/6 h-[calc(100%-60px)]">
        <p className="md:text-xl xl:text-[28px] text-dark-blue capitalize mb-5 ps-6" >
          <span onClick={redirectTo} className="cursor-pointer">

          My Bookmarks
          </span>
        </p>
        <ul
          className={`${
            loading?.fetchCategories ? "" : ""
          } rounded-xl border border-light-blue p-4 min-h-4/6 h-[calc(100%-62px)] xl:h-[calc(100%-60px)] bookmark-sidebar custom-scrollbar overflow-x-hidden overflow-y-auto`}
        >
          {loading?.fetchCategories ? (
            <div className="flex flex-wrap items-center justify-center h-full">
              <span className="loader"></span>
            </div>
          ) : (
            categories &&
            categories?.length > 0 &&
            categories?.map((category) => {
              const hasDropdown = category?.subcategories?.length > 0;
              const isActive =
                openAccordion === `users-accordion_${category?.id}`;
              return (
                <li
                  key={category?.id}
                  className={`${
                    isActive ? "active" : ""
                  } hs-accordion-group hs-accordion last:mb-0 relative`}
                  id={`users-accordion_${category?.id}`}
                >
                  <button
                    onClick={() => {
                      dispatch(updateListingtype("bookmark"));
                      setSearchResults(false);
                      setId({ categoryId: category?.id, subCategoryId: "" });
                      dispatch(clearInstantLink());
                      dispatch(setPageHeading(category?.title));
                      toggleAccordion(
                        `users-accordion_${category?.id}`,
                        hasDropdown
                      );
                    }}
                    type="button"
                    className={`group relative rounded-lg bg-lighter-blue mb-2 py-1.5 px-2.5 flex flex-wrap items-center text-sm text-light-black w-full focus:outline-none ${
                      isActive ? "" : ""
                    }`}
                    aria-expanded={isActive}
                    aria-controls={`users-accordion-collapse-${category?.id}`}
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="group absolute hs-accordion-toggle"
                    >
                      <path
                        d="M8.00037 14.9584C11.8434 14.9584 14.9587 11.843 14.9587 8C14.9587 4.157 11.8434 1.04163 8.00037 1.04163C4.15736 1.04163 1.04199 4.157 1.04199 8C1.04199 11.843 4.15736 14.9584 8.00037 14.9584Z"
                        stroke="#2131E5"
                        strokeWidth="0.625"
                        strokeMiterlimit="10"
                        strokeLinecap="round"
                        className="circle"
                      />
                      <path
                        d="M8 4.1875V11.8125"
                        stroke="#2131E5"
                        strokeWidth="0.625"
                        strokeMiterlimit="10"
                        strokeLinecap="round"
                        className="plus"
                      />
                      <path
                        d="M4.1875 8H11.8125"
                        stroke="#2131E5"
                        strokeWidth="0.625"
                        strokeMiterlimit="10"
                        strokeLinecap="round"
                        className="minus"
                      />
                    </svg>

                    <span className="block pl-6 text-start w-full">
                      {category?.title}
                    </span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                      className="size-4 shrink-0 absolute end-2 hover:text-red-600 opacity-0 invisible transition-all group-hover:opacity-100 group-hover:visible"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                      />
                    </svg>
                  </button>
                  {hasDropdown && (
                    <div
                      id={`users-accordion-collapse-${category?.id}`}
                      className={`hs-accordion-content w-full overflow-hidden transition-[height] duration-300 ${
                        isActive ? "block" : "hidden"
                      }`}
                      role="region"
                      aria-labelledby={`users-accordion_${category?.id}`}
                    >
                      <ul className="pt-1 ps-7 space-y-1">
                        {category?.subcategories?.map((subCat, subIndex) => {
                          return (
                            <li
                              className="hs-accordion-group hs-accordion relative"
                              id={`users-accordion-sub-${subIndex}`}
                              key={subIndex}
                            >
                              <button
                                onClick={() => {
                                  setSearchResults(false);
                                  dispatch(updateListingtype("bookmark"));
                                  dispatch(clearInstantLink());
                                  dispatch(
                                    setPageHeading(
                                      `${category?.title} | ${subCat?.title}`
                                    )
                                  );
                                  setId({
                                    categoryId: subCat?.parent_id,
                                    subCategoryId: subCat?.id
                                  });
                                }}
                                type="button"
                                className="group rounded-lg bg-lighter-blue mb-2 py-1.5 px-2.5 flex flex-wrap items-center space-x-2 text-base text-light-black w-full focus:outline-none"
                                aria-expanded="true"
                                aria-controls="users-accordion-sub-1-collapse-1"
                              >
                                <svg
                                  width="16"
                                  height="16"
                                  viewBox="0 0 16 16"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="hs-accordion-toggle"
                                >
                                  <path
                                    d="M8.00037 14.9584C11.8434 14.9584 14.9587 11.843 14.9587 8C14.9587 4.157 11.8434 1.04163 8.00037 1.04163C4.15736 1.04163 1.04199 4.157 1.04199 8C1.04199 11.843 4.15736 14.9584 8.00037 14.9584Z"
                                    stroke="#2131E5"
                                    strokeWidth="0.625"
                                    strokeMiterlimit="10"
                                    strokeLinecap="round"
                                    className="circle"
                                  />
                                  <path
                                    d="M8 4.1875V11.8125"
                                    stroke="#2131E5"
                                    strokeWidth="0.625"
                                    strokeMiterlimit="10"
                                    strokeLinecap="round"
                                  />
                                  <path
                                    d="M4.1875 8H11.8125"
                                    stroke="#2131E5"
                                    strokeWidth="0.625"
                                    strokeMiterlimit="10"
                                    strokeLinecap="round"
                                  />
                                </svg>
                                <span>{subCat?.title}</span>
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  strokeWidth={2}
                                  stroke="currentColor"
                                  className="size-4 shrink-0 absolute end-2 hover:text-red-600 transition-all opacity-0 invisible group-hover:opacity-100 group-hover:visible"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                                  />
                                </svg>
                              </button>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  )}
                </li>
              );
            })
          )}
        </ul>
      </div>
      <div className="rounded-xl border border-light-blue px-4 py-2 absolute bottom-0 xl:left-0 xl:right-0 mx-auto w-full">
        <button
          onClick={() => {
            dispatch(
              setPageHeading("Instant LinX - The Helpful Link Collections")
            );
            dispatch(linkFrontListing({ token }));
            dispatch(updateListingtype("link"));
          }}
          // cursor-pointer bg-dark-blue rounded-xl text-xl text-white gap-2 items-center py-2 px-3 absolute bottom-0 xl:bottom-4 xl:left-0 xl:right-0 mx-auto
          // !text-sm xl:!text-lg
          className="btn dark-btn !normal-case !text-white hover:!text-dark-blue !rounded-xl w-full !px-5 !text-lg"
        >
          Instant LinX - Bookmark Collections
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
