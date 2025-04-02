import React, { useEffect, useRef } from "react";
import "@preline/select";
import Input from "./elements/Input";
import { getToken } from "../../services/authService";
import axios from "axios";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import * as YUP from "yup";
import Dropdown from "../Dropdown";
import Textfield from "../Textfield";
import { useDispatch, useSelector } from "react-redux";
import {
  addNewCategory,
  getAdminCategory,
  getParentCategories,
  setEditingCategory,
  updateCategory
} from "../../redux/slices/adminSlice";

// const categoryUrl = `${process.env.REACT_APP_API_URL}/api/admin/categories`;

const AddCategory = () => {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const { parentCategories, editingCategory, categoryLoading } = useSelector(
    (state) => state.admin
  );

  const inputRef = useRef(null);

  useEffect(() => {
    if (token) {
      dispatch(getParentCategories(token));
    }
  }, [token, dispatch]);

  useEffect(() => {
    if (editingCategory) {
      if (inputRef.current) {
        inputRef.current.focus();
      }
      formik.setValues({
        title: editingCategory.title || "",
        parent_id: editingCategory.parent_id || ""
      });
    }
  }, [editingCategory?.id]);

  const formik = useFormik({
    initialValues: {
      title: "",
      parent_id: ""
    },
    validationSchema: YUP.object({
      title: YUP.string()
        .max(25, "Category name must not exceed 25 characters")
        .matches(/^[A-Za-z\s&]+$/, "Only letters, spaces and & are allowed") // ✅ No digits, no special symbols
        .required("Category Title is required"),
      parent_id: YUP.string().nullable().notRequired()
    }),
    onSubmit: async (values) => {
      try {
        let result;
        if (editingCategory) {
          // If editing, update the category
          result = await dispatch(
            updateCategory({ id: editingCategory.id, values, token })
          );
        } else {
          // Otherwise, add new category
          result = await dispatch(addNewCategory({ values, token }));
        }
        if (result.meta.requestStatus === "fulfilled") {
          toast.success(
            editingCategory
              ? "Category updated successfully!"
              : "Category added successfully!"
          );
          formik.resetForm();

          // Fetch updated categories list
          await dispatch(getAdminCategory(token));
        } else {
          if (result.payload?.isDuplicateEntry) {
            toast.error(result.payload?.isDuplicateEntry);
            return;
          }
          throw new Error(
            result.payload?.message || "Failed to save category!"
          );
        }
      } catch (error) {
        toast.error(error.message || "Failed to save category");
      } finally {
        dispatch(setEditingCategory(null));
      }
    }
  });

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm dark:bg-neutral-800 dark:border-neutral-700">
      <div className="px-6 py-4 grid gap-3 md:flex md:justify-between md:items-center border-b border-gray-200 dark:border-neutral-700">
        <div>
          <h2 className="text-xl font-semibold text-gray-800 dark:text-neutral-200">
            Category
          </h2>
          <p className="text-sm text-gray-600 dark:text-neutral-400">
            Add and update category.
          </p>
        </div>
      </div>
      <div className="flex flex-wrap p-6 rounded-md bg-white shadow-admin w-full">
        <form onSubmit={formik.handleSubmit} className="w-full">
          <div className="space-x-4 grid grid-cols-3 w-full">
            <div className="span-cols-1">
              <Textfield
                id="title"
                name="title"
                label="Categroy Title"
                autoFocus={false}
                type="text"
                placeholder="Enter Category Title"
                iconPlacement="left"
                fieldValue={formik.values.title}
                setFieldValue={formik.handleChange}
                setFieldValueOnBlur={formik.handleBlur}
                icon="category"
                ref={inputRef}
              />
              {formik.touched.title && formik.errors.title ? (
                <div className="text-red-500 text-sm mt-1">
                  {formik.errors.title}
                </div>
              ) : null}
            </div>
            <div className="span-cols-1">
              <Dropdown
                id="parent_id"
                name="parent_id"
                label="Parent Category"
                fieldValue={formik.values.parent_id}
                setFieldValue={(selectedOption) =>
                  formik.setFieldValue("parent_id", selectedOption?.value)
                }
                formik={formik}
                items={parentCategories}
                isDisabled={editingCategory?.id}
              />
              {formik.touched.parent_id && formik.errors.parent_id ? (
                <div className="text-red-500 text-sm mt-1">
                  {formik.errors.parent_id}
                </div>
              ) : null}
            </div>
            <div className="span-cols-1">
              <label htmlFor="" className="block text-base text-light-black mb-3 opacity-0">placeholder</label>
              <button
                type="submit"
                disabled={categoryLoading}
                className="py-3 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
              >
                {categoryLoading ? (
                  <>
                    <span className="loader"></span>{" "}
                    {editingCategory?.id
                      ? "Updating Category"
                      : "Saving Category"}
                  </>
                ) : (
                  <>
                    {editingCategory?.id ? "Update Category" : "Save Category"}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                      className="size-4"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M10.34 15.84c-.688-.06-1.386-.09-2.09-.09H7.5a4.5 4.5 0 1 1 0-9h.75c.704 0 1.402-.03 2.09-.09m0 9.18c.253.962.584 1.892.985 2.783.247.55.06 1.21-.463 1.511l-.657.38c-.551.318-1.26.117-1.527-.461a20.845 20.845 0 0 1-1.44-4.282m3.102.069a18.03 18.03 0 0 1-.59-4.59c0-1.586.205-3.124.59-4.59m0 9.18a23.848 23.848 0 0 1 8.835 2.535M10.34 6.66a23.847 23.847 0 0 0 8.835-2.535m0 0A23.74 23.74 0 0 0 18.795 3m.38 1.125a23.91 23.91 0 0 1 1.014 5.395m-1.014 8.855c-.118.38-.245.754-.38 1.125m.38-1.125a23.91 23.91 0 0 0 1.014-5.395m0-3.46c.495.413.811 1.035.811 1.73 0 .695-.316 1.317-.811 1.73m0-3.46a24.347 24.347 0 0 1 0 3.46"
                      />
                    </svg>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCategory;
