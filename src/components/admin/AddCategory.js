import React, { useEffect, useRef } from "react";
import "@preline/select";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import * as YUP from "yup";
import Dropdown from "../elements/Dropdown";
import Textfield from "../elements/Textfield";
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
  const { parentCategories, editingCategory, loading } = useSelector(
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
        .max(100, "Category name must not exceed 25 characters")
        // .matches(/^[A-Za-z\s&]+$/, "Only letters, spaces and & are allowed") // ✅ No digits, no special symbols
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
    <div className="cols-span-1 bg-white border border-gray-200 rounded-xl shadow-sm dark:bg-neutral-800 dark:border-neutral-700">
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
          <div className="space-y-4 grid grid-cols-1 w-full">
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
              {/* <label
                htmlFor=""
                className="block text-base text-light-black mb-3 opacity-0"
              >
                placeholder
              </label> */}
              <button
                type="submit"
                disabled={loading.addNewCategory}
                className={`btn dark-btn w-full justify-center h-12 ${
                  loading?.addNewCategory
                    ? "disabled:bg-light-blue disabled:text-dark-blue disabled:pointer-events-none"
                    : ""
                }`}
              >
                {loading?.addNewCategory ? (
                  <span className="loader"></span>
                ) : editingCategory?.id ? (
                  "Updating Category"
                ) : (
                  "Saving Category"
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
