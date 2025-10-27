import React, { useEffect, useState } from "react";
import Textfield from "../elements/Textfield";
import { useFormik } from "formik";
import * as YUP from "yup";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { updateAdminImage, updateProfileImage, updateUser, updateUserCountry } from "../../redux/slices/userSlice";
import axios from "axios";
import Dropdown from "../elements/Dropdown";

const UpdateAdmin = () => {
  const [countries, setCountry] = useState([]);
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const { user, loading, error } = useSelector((state) => state.user);
  const [file, setFile] = useState(null);

  const formik = useFormik({
    initialValues: {
      first_name: user?.first_name || "",
      last_name: user?.last_name || "",
      email: user?.email || "",
      country: user?.country || ""
    },
    validationSchema: YUP.object({
      first_name: YUP.string()
        .min(2, "First Name must be atleast 2 characters")
        .required("First Name is required"),
      last_name: YUP.string()
        .min(2, "Last Name must be atleast 2 characters")
        .required("Last Name is required"),
      email: YUP.string()
        .email("Invalid email format")
        .required("Email is required"),
      country: YUP.string().required("Please select a country")
    }),
    onSubmit: async (values) => {
      let userId = user?.id;
      const result = await dispatch(updateUser({ token, values, userId }));
      if (updateUser.fulfilled.match(result)) {
        toast.success(result.payload.message || "Admin updated successfully!");
        dispatch(updateUserCountry(values));
      } else {
        toast.error(result.payload || "Register failed!");
      }
    }
  });
  useEffect(() => {
    const getCountryList = async () => {
      let response = await axios.get(
        "https://valid.layercode.workers.dev/list/countries?format=select&flags=true&value=code"
      );
      setCountry(response?.data?.countries);
    };
    getCountryList();
  }, []);

  const updateAdminProfileImage = async (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);

      let formData = new FormData();
      formData.append("profile_image", selectedFile);

      try {
        let result = await dispatch(updateAdminImage(formData)).unwrap();
        toast.success(result.message || "Profile image updated successfully!");
        setFile(result.profile_image_url)
        dispatch(updateProfileImage(result.profile_image_url))
        console.log(result, 'result');
      } catch (error) {
        console.error("Upload error:", error);
      }

    }
  }
  return (
    <div className="w-full lg:ps-64">
      <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
        <div className="bg-white border border-gray-200 rounded-xl shadow-2xs">
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm ">
            <div className="px-6 py-4 grid gap-3 md:flex md:justify-between md:items-center border-b border-gray-200 ">
              <div>
                <h2 className="text-xl font-semibold text-gray-800 ">
                  Update Admin Information
                </h2>
                <p className="text-sm text-gray-600 ">
                  Update basic your information.
                </p>
              </div>
            </div>
            <div className="flex flex-wrap flex-col pt-6 px-6 rounded-md bg-white shadow-admin w-full">
              <img className="inline-block size-16 rounded-full ring-2 ring-white dark:ring-neutral-900 mb-4" src={`${user?.profile_image}`} alt="Avatar" />
              <label className="block text-base text-light-black mb-3">
                Profile photo
              </label>
              <label htmlFor="file-input" className="sr-only">Choose file</label>
              <input onChange={(e) => updateAdminProfileImage(e)} type="file" accept="image/*" name="profile_image" id="profile_image" className="block w-full border border-dark-blue shadow-sm rounded-lg text-sm focus:z-10 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none file:bg-gray-50 file:border-0 file:me-4 file:py-3 file:px-4" />
            </div>
            <form
              onSubmit={formik.handleSubmit}
              className="flex flex-wrap flex-col p-6 rounded-md bg-white shadow-admin w-full"
            >
              <div className="mb-5">
                <Textfield
                  id="update_user_first_name"
                  name="first_name"
                  icon="title"
                  fieldValue={formik.values.first_name}
                  setFieldValue={formik.handleChange}
                  setFieldValueOnBlur={formik.handleBlur}
                  label="First Name"
                  type="text"
                  placeholder=""
                  iconPlacement="left"
                />
                {formik.touched.first_name && formik.errors.first_name ? (
                  <div className="text-red-500 text-sm mt-1">
                    {formik.errors.first_name}
                  </div>
                ) : null}
              </div>
              <div className="mb-5">
                <Textfield
                  id="update_user_last_name"
                  name="last_name"
                  icon="title"
                  fieldValue={formik.values.last_name}
                  setFieldValue={formik.handleChange}
                  setFieldValueOnBlur={formik.handleBlur}
                  label="Last Name"
                  type="text"
                  placeholder=""
                  iconPlacement="left"
                />
                {formik.touched.last_name && formik.errors.last_name ? (
                  <div className="text-red-500 text-sm mt-1">
                    {formik.errors.last_name}
                  </div>
                ) : null}
              </div>
              <div className="mb-5">
                <Textfield
                  id="update_user_email"
                  name="email"
                  label="Email"
                  type="email"
                  iconPlacement="left"
                  fieldValue={formik.values.email}
                  setFieldValue={formik.handleChange}
                  setFieldValueOnBlur={formik.handleBlur}
                />
                {formik.touched.email && formik.errors.email ? (
                  <div className="text-red-500 text-sm mt-1">
                    {formik.errors.email}
                  </div>
                ) : null}
              </div>
              <div className="mb-5">
                <Dropdown
                  isDisabled={countries?.length === 0}
                  id="country"
                  name="country"
                  label="Country"
                  placeholder="Select an option"
                  fieldValue={formik.values.country}
                  setFieldValue={(selectedOption) => {
                    formik.setFieldValue(
                      "country",
                      selectedOption?.value ? selectedOption?.value : user
                    );
                  }}
                  items={countries}
                  formik={formik}
                />
                {formik.touched.country && formik.errors.country ? (
                  <div className="text-red-500 text-sm mt-1">
                    {formik.errors.country}
                  </div>
                ) : null}
              </div>
              <button
                disabled={loading?.updateUser}
                type="submit"
                className={`btn dark-btn w-full justify-center h-12 ${loading?.updateUser
                    ? "disabled:bg-light-blue disabled:text-dark-blue disabled:pointer-events-none"
                    : ""
                  }`}
              >
                {loading?.updateUser ? (
                  <span className="loader"></span>
                ) : (
                  "Update Information"
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateAdmin;
