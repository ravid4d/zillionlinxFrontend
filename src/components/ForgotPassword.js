import React, { useState } from "react";
import Textfield from "./Textfield";
import { Link } from "react-router-dom";
import { useFormik } from "formik";
import axios from "axios";
import * as YUP from "yup";
import { toast } from "react-toastify";
import { handleForgotPassword } from "../redux/slices/registerSlice";
import { useDispatch, useSelector } from "react-redux";


const ForgotPassword = ({ closeAllModals, openModal }) => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.register);
  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: YUP.object({
      email: YUP.string()
        .email("Invalid email format")
        .required("Email is required"),
    }),
    onSubmit: (values) => {
      forgotPasswordHandler(values);
    },
  });

  const forgotPasswordHandler = async (values) => {
    try {
      const email = values?.email;
      const result = await dispatch(handleForgotPassword({ email })).unwrap();
      toast.success(result.message);
    } catch (error) {
      toast.error(error.message);
    } finally {
      closeModal("forgot-password");
    }
  };
  const closeModal = () => {
    formik.resetForm();
    closeAllModals();
  };

  return (
    <div
      id="forgot-password"
      className={`hs-overlay [--overlay-backdrop:static] ${
        openModal?.forgot ? "open opened" : "hidden"
      } size-full fixed top-0 start-0 z-[80] overflow-x-hidden overflow-y-auto pointer-events-none`}
      role="dialog"
      tabIndex="-1"
      aria-labelledby="forgot-password-label"
      data-hs-overlay-keyboard="false"
    >
      <div className="hs-overlay-animation-target hs-overlay-open:mt-7 hs-overlay-open:opacity-100 hs-overlay-open:duration-500 mt-0 opacity-0 ease-out transition-all max-w-xl xl:max-w-[600px] md:w-full m-6 sm:mx-auto min-h-[calc(100%-3.5rem)] flex items-center">
        <div className="flex flex-col bg-pattern bg-no-repeat bg-cover bg-center border shadow-sm rounded-[30px] pointer-events-auto w-full relative">
          <div className="w-full py-20 px-10">
            <div className="flex justify-between items-center flex-col max-w-[400px] mx-auto">
              <h3
                id="forgot-password-label"
                className="uppercase text-dark-blue text-center w-full text-3xl xl:text-5xl mb-6"
              >
                Forgot <br />
                Password?
              </h3>
              <button
                type="button"
                onClick={closeModal}
                className="absolute top-5 right-5 size-9 inline-flex justify-center items-center rounded-full border border-transparent bg-dark-blue text-light-blue hover:bg-light-blue hover:text-dark-blue focus:outline-none focus:bg-light-blue focus:text-dark-blue disabled:opacity-50 disabled:pointer-events-none"
                aria-label="Close"
                data-hs-overlay="#forgot-password"
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
                    id="forgotPasswordEmail"
                    name="email"
                    label="Email"
                    type="email"
                    placeholder="Enter email"
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
                <button
                  disabled={loading}
                  type="submit"
                  className={`btn dark-btn w-full justify-center h-12 ${
                    loading
                      ? "disabled:bg-light-blue disabled:text-dark-blue disabled:pointer-events-none"
                      : ""
                  }`}
                >
                  Recover Password
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
