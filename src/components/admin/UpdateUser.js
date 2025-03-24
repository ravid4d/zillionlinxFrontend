import { useFormik } from "formik";
import * as YUP from "yup";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { handleLogin } from "../../redux/slices/authSlice";
import { toast } from "react-toastify";
import Textfield from "../Textfield";
import CountryDropdown from "../CountryDropdown";
import Dropdown from "../Dropdown";
import axios from "axios";
import { getAllUsers, updateUser } from "../../redux/slices/userSlice";
// import preline from "preline/plugin";

const UpdateUser = ({ userToEditModal, setUserToEditModal, loading, userToEdit }) => {
  const dispatch = useDispatch();
  const[countries, setCountry] = useState([]);
  const {token} = useSelector(state=>state.auth);

  useEffect(()=>{
    const getCountryList = async() => {
      let response = await axios.get("https://valid.layercode.workers.dev/list/countries?format=select&flags=true&value=code");
      setCountry(response?.data?.countries);
    }
    getCountryList()
  }, []);

  
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      first_name: userToEdit?.first_name || "",
      last_name: userToEdit?.last_name || "",
      email: userToEdit?.email || "",
      country: userToEdit?.country || "",
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
        let userId = userToEdit?.id;
        const result = await dispatch(updateUser({token, values, userId}));
        if (updateUser.fulfilled.match(result)) {
          toast.success(result.payload.message || "User Updated successfully!")
          formik.resetForm();
          setUserToEditModal(false);
          dispatch(getAllUsers());
        } else {
          toast.error(result.payload || "User Updation failed!");
        }
      }
    });
  return (
    <div
      id="updateUser"
      className={`hs-overlay [--overlay-backdrop:static] ${
        userToEditModal ? "open opened" : "hidden"
      } size-full fixed top-0 start-0 z-[80] overflow-x-hidden overflow-y-auto pointer-events-none`}
      role="dialog"
      tabIndex="-1"
      aria-labelledby="updateUser-label"
      data-hs-overlay-keyboard="false"
    >
      <div className="hs-overlay-animation-target hs-overlay-open:mt-7 hs-overlay-open:opacity-100 hs-overlay-open:duration-500 mt-0 opacity-0 ease-out transition-all sm:max-w-2xl sm:w-full m-3 sm:mx-auto min-h-[calc(100%-3.5rem)] flex items-center">
        <div className="flex flex-col bg-pattern bg-no-repeat bg-cover bg-center border shadow-sm rounded-[30px] pointer-events-auto w-full relative">
          <div className="w-full py-20 px-10">
            <div className="flex justify-between items-center">
              <h3
                id="updateUser-label"
                className="uppercase text-dark-blue text-center w-full text-7xl mb-12"
              >
                Edit User
              </h3>
              <button
                type="button"
                onClick={() => setUserToEditModal(false)}
                className="absolute top-5 right-5 size-9 inline-flex justify-center items-center rounded-full border border-transparent bg-dark-blue text-light-blue hover:bg-light-blue hover:text-dark-blue focus:outline-none focus:bg-light-blue focus:text-dark-blue disabled:opacity-50 disabled:pointer-events-none"
                aria-label="Close"
                data-hs-overlay="#updateUser"
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
                    id="first_name"
                    name="first_name"
                    icon="title"
                    fieldValue={formik.values.first_name?formik.values?.first_name:userToEdit?.first_name}
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
                    id="last_name"
                    name="last_name"
                    icon="title"
                    fieldValue={formik.values.last_name?formik.values?.last_name:userToEdit?.last_name}
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
                    id="registerEmail"
                    name="email"
                    label="Email"
                    type="email"
                    iconPlacement="left"
                    fieldValue={formik.values.email?formik.values?.email:userToEdit?.email}
                    setFieldValue={formik.handleChange}
                    setFieldValueOnBlur={formik.handleBlur}
                  />
                  {formik.touched.email && formik.errors.email ? (
                    <div className="text-red-500 text-sm mt-1">
                      {formik.errors.email}
                    </div>
                  ) : null}
                </div>
                {
                  countries?.length>0&&
                  <div className="mb-5">
                  <Dropdown
                    id="country"
                    name="country"
                    label="Country"
                    fieldValue={formik.values.country?formik.values.country:userToEdit?.country}
                    setFieldValue={(selectedOption) => {
                      formik.setFieldValue("country", selectedOption?.value?selectedOption?.value:userToEdit);
                    }}
                    items={countries}
                    />
                  {formik.touched.country && formik.errors.country ? (
                    <div className="text-red-500 text-sm mt-1">
                      {formik.errors.country}
                    </div>
                  ) : null}
                </div>
                }
                <button
                  disabled={loading}
                  type="submit"
                  className={`btn dark-btn w-full justify-center h-12 ${
                    loading
                      ? "disabled:bg-light-blue disabled:text-dark-blue disabled:pointer-events-none"
                      : ""
                  }`}
                >
                  sign up
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateUser;