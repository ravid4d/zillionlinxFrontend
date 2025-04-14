import React, { useEffect, useState } from "react";
import Textfield from "../elements/Textfield";
import { useFormik } from "formik";
import * as YUP from "yup";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { updateUser, updateUserCountry } from "../../redux/slices/userSlice";
import axios from "axios";
import Dropdown from "../elements/Dropdown";

const UpdateAdmin = () => {
    const[countries, setCountry] = useState([]);
    const dispatch = useDispatch();
    const { loading, token } = useSelector((state) => state.auth);
    const { user } = useSelector((state) => state.user);
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
        const result = await dispatch(updateUser({token, values, userId}));
        if (updateUser.fulfilled.match(result)) {
          toast.success(result.payload.message || "Admin updated successfully!");
          dispatch(updateUserCountry(values));
        } else {
          toast.error(result.payload || "Register failed!");
        }
      }
    });
    useEffect(()=>{
      const getCountryList = async() => {
        let response = await axios.get("https://valid.layercode.workers.dev/list/countries?format=select&flags=true&value=code");
        setCountry(response?.data?.countries);
      }
      getCountryList()
    }, []);
  return (
    <div className="w-full lg:ps-64">
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      <div className="bg-white border border-gray-200 rounded-xl shadow-2xs">
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm dark:bg-neutral-800 dark:border-neutral-700">
          <div className="px-6 py-4 grid gap-3 md:flex md:justify-between md:items-center border-b border-gray-200 dark:border-neutral-700">
            <div>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-neutral-200">
                Update Admin Information
              </h2>
              <p className="text-sm text-gray-600 dark:text-neutral-400">
                Update basic your information.
              </p>
            </div>
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
                    isDisabled={countries?.length===0}
                    id="country"
                    name="country"
                    label="Country"
                    placeholder="Select an option"
                    fieldValue={formik.values.country}
                    setFieldValue={(selectedOption) => {
                      formik.setFieldValue("country", selectedOption?.value?selectedOption?.value:user);
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
                  disabled={loading}
                  type="submit"
                  className={`btn dark-btn w-full justify-center h-12 ${
                    loading
                      ? "disabled:bg-light-blue disabled:text-dark-blue disabled:pointer-events-none"
                      : ""
                  }`}
                >
                    Update Information
                </button>
          </form>
        </div>
      </div>
    </div>
  </div>
  )
}

export default UpdateAdmin
