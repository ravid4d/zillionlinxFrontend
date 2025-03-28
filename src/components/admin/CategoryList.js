import React, { useEffect, useState } from "react";
import categoryData from "../../json/category.json";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import moment from "moment";
import {
  getAdminCategory,
  setEditingCategory,
  deleteCategory,
  setSearchQuery,
  handleCategoryPagination,
} from "../../redux/slices/adminSlice";
import useDebounce from "../../hooks/useDebounce";

const categoryUrl = `${process.env.REACT_APP_API_URL}/api/admin/categories`;

const CategoryList = ({ classes }) => {
  const dispatch = useDispatch();
  const [categories, setCategories] = useState([]);
  const [activeId, setActiveId] = useState(undefined);
  const [selectedItems, setSelectedItems] = useState({});
  const {
    adminCategories,
    paginationCategories,
    totalCategories,
    searchQuery,
  } = useSelector((state) => state.admin);
  const debouncedQuery = useDebounce(searchQuery, 500);

  useEffect(() => {
    if (adminCategories?.length > 0) {
      setCategories(adminCategories);
    }
  }, [adminCategories]);

  const { token } = useSelector((state) => state.auth);
  useEffect(() => {
    if (token) {
      dispatch(getAdminCategory(token));
    }
  }, [token, dispatch, debouncedQuery]);

  useEffect(() => {
    return () => {
      dispatch(setSearchQuery(""));
    };
  }, [dispatch]);

  const activeTab = (activeId) => {
    setActiveId((prev) => (prev === activeId ? undefined : activeId));
  };

  const handleCategorySelect = (categoryId, subcategories = []) => {
    setSelectedItems((prev) => {
      const isSelected = prev[categoryId];

      // If selected, remove it and its subcategories
      if (isSelected) {
        const updatedSelection = { ...prev };
        delete updatedSelection[categoryId];
        subcategories.forEach((sub) => delete updatedSelection[sub.id]);
        return updatedSelection;
      }

      // Otherwise, select it along with subcategories
      const newSelection = { ...prev, [categoryId]: true };
      subcategories.forEach((sub) => (newSelection[sub.id] = true));
      return newSelection;
    });
  };

  const handleSubcategorySelect = (
    categoryId,
    subcategoryId,
    subcategories
  ) => {
    setSelectedItems((prev) => {
      const isSelected = prev[subcategoryId];

      // If selected, remove it
      if (isSelected) {
        const updatedSelection = { ...prev };
        delete updatedSelection[subcategoryId];

        // If the category was selected but now all subcategories are unselected, uncheck category
        const anyRemaining = subcategories.some(
          (sub) => updatedSelection[sub.id]
        );
        if (!anyRemaining) {
          delete updatedSelection[categoryId];
        }
        return updatedSelection;
      }

      // Otherwise, select the subcategory
      const newSelection = { ...prev, [subcategoryId]: true };

      // If all subcategories are now selected, select the parent category too
      const allSelected = subcategories.every((sub) => newSelection[sub.id]);
      if (allSelected) {
        newSelection[categoryId] = true;
      }

      return newSelection;
    });
  };

  const handleEditCategory = (category) => {
    dispatch(setEditingCategory(category));
  };

  const handlePagination = async (url) => {
    dispatch(handleCategoryPagination({ url, token }));
  };

  const handlesingleDelete = (id) => {
    const confirmDelete = () => {
      dispatch(deleteCategory({ ids: id, token }))
        .unwrap()
        .then(() => {
          dispatch(getAdminCategory(token));
        })
        .catch((err) => {});
    };

    // Show confirmation toast with Yes/No buttons
    Swal.fire({
      title: "Are you sure?",
      text: "Do you really want to delete this category?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d9534f",
      cancelButtonColor: "#5bc0de",
      confirmButtonText: "Yes, delete!",
      cancelButtonText: "No, cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        confirmDelete();
        setSelectedItems({})
        Swal.fire("Deleted!", "Category have been removed.", "success");
      }
    });
  };
  const handlemultipleDelete = () => {
    const selectedIds = Object.keys(selectedItems).filter(
      (id) => selectedItems[id]
    );
    // alert(selectedIds);
    if (selectedIds.length === 0) {
      Swal.fire(
        "No categories selected",
        "Please select at least one category.",
        "warning"
      );
      return;
    }

    const confirmDelete = () => {
      dispatch(deleteCategory({ ids: selectedIds, token }))
        .unwrap()
        .then(() => {
          dispatch(getAdminCategory(token));
        })
        .catch((err) => {});
    };

    // Show confirmation toast with Yes/No buttons
    Swal.fire({
      title: "Are you sure?",
      text: "Do you really want to delete these categories?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d9534f",
      cancelButtonColor: "#5bc0de",
      confirmButtonText: "Yes, delete!",
      cancelButtonText: "No, cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        confirmDelete();
        setSelectedItems({})
        Swal.fire("Deleted!", "Categories have been removed.", "success");
      }
    });
  };

  const selectedCount = Object.values(selectedItems).filter(Boolean).length;

  return (
    <div className={classes}>
      <div className="flex flex-col">
        <div className="overflow-x-auto">
          <div className="min-w-full inline-block align-middle">
            <div className="bg-white border overflow-x-auto border-gray-200 rounded-md shadow-sm overflow-hidden dark:bg-neutral-800 dark:border-neutral-700">
              <div className="px-6 py-4 grid gap-3 md:flex md:justify-between md:items-center border-b border-gray-200 dark:border-neutral-700">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-neutral-200">
                      Categories
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-neutral-400">
                      Update and delete categories.
                    </p>
                  </div>
                  <div className="inline-flex gap-x-2">
                    <button
                      onClick={handlemultipleDelete}
                      className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-2xs hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none focus:outline-hidden focus:bg-gray-50"
                      disabled={selectedCount === 0 ? "disabled" : ""}
                    >
                      Delete Selected
                    </button>
                  </div>
              </div>
              <div className="w-full overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 table-auto">
                  <thead className="bg-gray-50 dark:bg-neutral-800">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-start">
                        <label
                          htmlFor="hs-at-with-checkboxes-main"
                          className="flex"
                        >
                          <input
                            type="checkbox"
                            checked={
                              categories?.length > 0 &&
                              categories.every((cat) => selectedItems[cat.id])
                            }
                            onChange={() =>
                              categories.forEach((cat) =>
                                handleCategorySelect(cat.id, cat.subcategories)
                              )
                            }
                            className="shrink-0 border-gray-300 rounded text-blue-600 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-600 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800"
                            id="hs-at-with-checkboxes-main"
                          />
                          <span className="sr-only">Checkbox</span>
                        </label>
                      </th>

                      <th
                        scope="col"
                        className="ps-6 lg:ps-3 xl:ps-0 pe-6 py-3 text-start"
                      >
                        <div className="flex items-center gap-x-2">
                          <span className="whitespace-nowrap text-xs font-semibold uppercase tracking-wide text-gray-800 dark:text-neutral-200">
                            ID
                          </span>
                        </div>
                      </th>

                      <th
                        scope="col"
                        className="ps-6 lg:ps-3 xl:ps-0 pe-6 py-3 text-start"
                      >
                        <div className="flex items-center gap-x-2">
                          <span className="text-xs font-semibold uppercase tracking-wide text-gray-800 dark:text-neutral-200">
                            Title
                          </span>
                        </div>
                      </th>

                      <th scope="col" className="px-6 py-3 text-start">
                        <div className="flex items-center gap-x-2">
                          <span className="text-xs font-semibold uppercase tracking-wide text-gray-800 dark:text-neutral-200">
                            Parent Category
                          </span>
                        </div>
                      </th>

                      <th scope="col" className="px-6 py-3 text-start">
                        <div className="flex items-center gap-x-2">
                          <span className="text-xs font-semibold uppercase tracking-wide text-gray-800 dark:text-neutral-200">
                            Created
                          </span>
                        </div>
                      </th>

                      <th scope="col" className="px-6 py-3 text-end"></th>
                      <th scope="col" className="px-6 py-3 text-end"></th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-200">
                    {categories &&
                      categories?.length > 0 &&
                      categories?.map((category) => {
                        return (
                          <React.Fragment key={category?.id}>
                            <tr>
                              <td className="size-px whitespace-nowrap">
                                <div className="px-6 py-3">
                                  <label
                                    htmlFor="hs-at-with-checkboxes-1"
                                    className="flex"
                                  >
                                    <input
                                      type="checkbox"
                                      checked={!!selectedItems[category.id]}
                                      onChange={() =>
                                        handleCategorySelect(
                                          category.id,
                                          category.subcategories
                                        )
                                      }
                                      className="shrink-0 border-gray-300 rounded text-blue-600 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-600 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800"
                                      id="hs-at-with-checkboxes-1"
                                    />
                                    <span className="sr-only">Checkbox</span>
                                  </label>
                                </div>
                              </td>
                              <td className="size-px whitespace-nowrap">
                                <div className="ps-6 lg:ps-3 xl:ps-0 pe-6 py-3 text-start">
                                  {category?.id}
                                </div>
                              </td>
                              <td className="size-px whitespace-nowrap">
                                <div className="ps-6 lg:ps-3 xl:ps-0 pe-6 py-3">
                                  <span className="block text-sm font-semibold text-gray-800 dark:text-neutral-200 mb-1">
                                    {category?.title}
                                  </span>
                                </div>
                              </td>
                              <td className="h-px w-36"></td>

                              <td className="size-px whitespace-nowrap">
                                <div className="px-6 py-3">
                                  <span className="text-sm text-gray-500 dark:text-neutral-500">
                                    {moment(category?.created_at).format(
                                      "MMMM Do YYYY"
                                    )}
                                  </span>
                                </div>
                              </td>
                              <td className="size-px whitespace-nowrap">
                                <div className="px-6 py-1.5">
                                  <button
                                    className="inline-flex items-center gap-x-1 text-sm text-blue-600 decoration-2 hover:underline focus:outline-none focus:underline font-medium dark:text-blue-500"
                                    onClick={() => handleEditCategory(category)}
                                  >
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      strokeWidth={2}
                                      stroke="currentColor"
                                      className="size-5"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                                      />
                                    </svg>
                                  </button>
                                  <button
                                    className="inline-flex items-center gap-x-1 text-sm text-blue-600 decoration-2 hover:underline focus:outline-none focus:underline font-medium dark:text-blue-500"
                                    onClick={() =>handlesingleDelete(category.id)}
                                  >
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      strokeWidth={2}
                                      stroke="currentColor"
                                      className="size-5"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                                      />
                                    </svg>
                                  </button>
                                </div>
                              </td>
                              <td className="size-px whitespace-nowrap">
                                {category?.subcategories &&
                                category?.subcategories?.length > 0 ? (
                                  <div className="px-6 py-1.5">
                                    <button
                                      type="button"
                                      onClick={() => activeTab(category?.id)}
                                      className="hs-collapse-toggle inline-flex items-center gap-x-1 text-sm font-semibold rounded-lg border border-transparent text-blue-600 decoration-2 hover:text-blue-700 hover:underline focus:outline-hidden focus:underline focus:text-blue-700 disabled:opacity-50 disabled:pointer-events-none dark:text-blue-500 dark:hover:text-blue-600 dark:focus:text-blue-600"
                                      id={`hs-show-hide-collapse_${category?.id}`}
                                      aria-expanded="false"
                                      aria-controls={`hs-show-hide-collapse-heading_${category?.id}`}
                                      data-hs-collapse={`#hs-show-hide-collapse-heading_${category?.id}`}
                                    >
                                      <svg
                                        className={`hs-collapse-open: ${
                                          activeId === category?.id
                                            ? "rotate-180"
                                            : ""
                                        } shrink-0 size-4`}
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
                                        <path d="m6 9 6 6 6-6"></path>
                                      </svg>
                                    </button>
                                  </div>
                                ) : null}
                              </td>
                            </tr>
                            {category?.subcategories &&
                            category?.subcategories?.length > 0 ? (
                              <tr className="border-0">
                                <td colSpan="7" className="p-0 border-0">
                                  <table
                                    id={`hs-show-hide-collapse-heading_${category?.id}`}
                                    className={`hs-collapse ${
                                      activeId === category?.id
                                        ? "open"
                                        : "hidden"
                                    } w-full overflow-hidden transition-[height] duration-300 `}
                                    aria-labelledby={`hs-show-hide-collapse_${category?.id}`}
                                  >
                                    <thead className="bg-gray-50 dark:bg-neutral-800">
                                      <tr>
                                        <th
                                          scope="col"
                                          className="px-6 py-3 text-end"
                                        ></th>
                                        <th
                                          scope="col"
                                          className="px-6 py-3 text-start"
                                        >
                                          <label
                                            htmlFor="hs-at-with-checkboxes-main"
                                            className="flex"
                                          >
                                            <input
                                              type="checkbox"
                                              className="shrink-0 border-gray-300 rounded text-blue-600 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-600 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800"
                                              id="hs-at-with-checkboxes-main"
                                            />
                                            <span className="sr-only">
                                              Checkbox
                                            </span>
                                          </label>
                                        </th>

                                        <th
                                          scope="col"
                                          className="ps-6 lg:ps-3 xl:ps-0 pe-6 py-3 text-start"
                                        >
                                          <div className="flex items-center gap-x-2">
                                            <span className="whitespace-nowrap text-xs font-semibold uppercase tracking-wide text-gray-800 dark:text-neutral-200">
                                              ID
                                            </span>
                                          </div>
                                        </th>

                                        <th
                                          scope="col"
                                          className="ps-6 lg:ps-3 xl:ps-0 pe-6 py-3 text-start"
                                        >
                                          <div className="flex items-center gap-x-2">
                                            <span className="text-xs font-semibold uppercase tracking-wide text-gray-800 dark:text-neutral-200">
                                              Title
                                            </span>
                                          </div>
                                        </th>

                                        <th
                                          scope="col"
                                          className="px-6 py-3 text-start"
                                        >
                                          <div className="flex items-center gap-x-2">
                                            <span className="text-xs font-semibold uppercase tracking-wide text-gray-800 dark:text-neutral-200">
                                              Parent Category
                                            </span>
                                          </div>
                                        </th>

                                        <th
                                          scope="col"
                                          className="px-6 py-3 text-start"
                                        >
                                          <div className="flex items-center gap-x-2">
                                            <span className="text-xs font-semibold uppercase tracking-wide text-gray-800 dark:text-neutral-200">
                                              Created
                                            </span>
                                          </div>
                                        </th>
                                        <th
                                          scope="col"
                                          className="px-6 py-3 text-start"
                                        ></th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {category?.subcategories?.map((sub) => {
                                        return (
                                          <tr key={sub?.id}>
                                            <td className="size-px whitespace-nowrap"></td>
                                            <td className="size-px whitespace-nowrap">
                                              <div className="px-6 py-3">
                                                <label
                                                  htmlFor="hs-at-with-checkboxes-1"
                                                  className="flex"
                                                >
                                                  <input
                                                    type="checkbox"
                                                    checked={
                                                      !!selectedItems[sub.id]
                                                    }
                                                    onChange={() =>
                                                      handleSubcategorySelect(
                                                        category.id,
                                                        sub.id,
                                                        category.subcategories
                                                      )
                                                    }
                                                    className="shrink-0 border-gray-300 rounded text-blue-600 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-600 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800"
                                                    id="hs-at-with-checkboxes-1"
                                                  />
                                                  <span className="sr-only">
                                                    Checkbox
                                                  </span>
                                                </label>
                                              </div>
                                            </td>
                                            <td className="size-px whitespace-nowrap">
                                              <div className="ps-6 lg:ps-3 xl:ps-0 pe-6 py-3 text-start">
                                                {sub?.id}
                                              </div>
                                            </td>
                                            <td className="size-px whitespace-nowrap">
                                              <div className="ps-6 lg:ps-3 xl:ps-0 pe-6 py-3">
                                                <span className="block text-sm font-semibold text-gray-800 dark:text-neutral-200 mb-1">
                                                  {sub?.title}
                                                </span>
                                              </div>
                                            </td>
                                            <td className="h-px w-36">
                                              <div className="px-6 py-3">
                                                <span className="block text-sm text-gray-500 dark:text-neutral-500">
                                                  {sub?.parent_id}
                                                </span>
                                              </div>
                                            </td>
                                            <td className="size-px whitespace-nowrap">
                                              <div className="px-6 py-3">
                                                <span className="text-sm text-gray-500 dark:text-neutral-500">
                                                  {moment(
                                                    category?.created_at
                                                  ).format("MMMM Do YYYY")}
                                                </span>
                                              </div>
                                            </td>
                                            <td className="size-px whitespace-nowrap">
                                              <div className="px-6 py-1.5">
                                                <button
                                                  className="inline-flex items-center gap-x-1 text-sm text-blue-600 decoration-2 hover:underline focus:outline-none focus:underline font-medium dark:text-blue-500"
                                                  onClick={() =>handleEditCategory(sub)}
                                                >
                                                  <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    strokeWidth={2}
                                                    stroke="currentColor"
                                                    className="size-5"
                                                  >
                                                    <path
                                                      strokeLinecap="round"
                                                      strokeLinejoin="round"
                                                      d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                                                    />
                                                  </svg>
                                                </button>
                                                <button
                                                  className="inline-flex items-center gap-x-1 text-sm text-blue-600 decoration-2 hover:underline focus:outline-none focus:underline font-medium dark:text-blue-500"
                                                  onClick={() =>handlesingleDelete(sub.id)}
                                                >
                                                  <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    strokeWidth={2}
                                                    stroke="currentColor"
                                                    className="size-5"
                                                  >
                                                    <path
                                                      strokeLinecap="round"
                                                      strokeLinejoin="round"
                                                      d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                                                    />
                                                  </svg>
                                                </button>
                                              </div>
                                            </td>
                                          </tr>
                                        );
                                      })}
                                    </tbody>
                                  </table>
                                </td>
                              </tr>
                            ) : null}
                          </React.Fragment>
                        );
                      })}
                  </tbody>
                </table>
              </div>
              <div className="px-6 py-4 grid gap-3 md:flex md:justify-between md:items-center border-t border-gray-200 dark:border-neutral-700">
                <div>
                  <p className="text-sm text-gray-600 dark:text-neutral-400">
                    <span className="font-semibold text-gray-800 dark:text-neutral-200">
                      {totalCategories}
                    </span>{" "}
                    results
                  </p>
                </div>

                <div>
                  {/* Counter Pagination */}
                  <div className="inline-flex gap-x-2">
                    {paginationCategories &&
                      paginationCategories?.length > 0 &&
                      paginationCategories.map((pageNumber, index) => {
                        return (
                          <button
                            key={index}
                            type="button"
                            disabled={pageNumber?.url === null}
                            onClick={() => handlePagination(pageNumber?.url)}
                            className={`${
                              pageNumber?.active ? "bg-gray-100" : "bg-white"
                            } py-1.5 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 text-gray-800 shadow-2xs hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none focus:outline-hidden focus:bg-gray-50 dark:bg-transparent dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:focus:bg-neutral-800`}
                          >
                            {index === 0
                              ? "<"
                              : index === paginationCategories?.length - 1
                              ? ">"
                              : pageNumber?.label}
                          </button>
                        );
                      })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryList;
