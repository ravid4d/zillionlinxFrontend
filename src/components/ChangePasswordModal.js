import React, {useState } from "react";
import { useFormik } from "formik";
import * as YUP from "yup";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import PasswordField from "./PasswordField";
import {  useNavigate } from "react-router-dom";
import { updateUserPassword } from "../redux/slices/userSlice";
import { handleLogout } from "../redux/slices/authSlice";
// import { logout } from "../redux/slices/authSlice";

const ChangePasswordModal = ({ openModal, closeAllModals }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { loading } = useSelector((state) => state.user);
  const { token } = useSelector((state) => state.auth);

  const formik = useFormik({
    initialValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    validationSchema: YUP.object({
      currentPassword: YUP.string().required("Current password is required"),
      newPassword: YUP.string()
        .min(8, "Password must be at least 8 characters")
        .max(16, "Password must not exceed 16 characters")
        .matches(/[a-z]/, "Must include at least one lowercase letter")
        .matches(/[A-Z]/, "Must include at least one uppercase letter")
        .matches(/\d/, "Must include at least one number")
        // .matches(/[@$!%*?&]/, "Must include at least one special character (@$!%*?&)")
        .required("New password is required"),
      confirmPassword: YUP.string()
        .oneOf([YUP.ref("newPassword"), null], "Passwords must match")
        .required("Confirm Password is required"),
    }),
    onSubmit: async (values) => {
      const result = await dispatch(updateUserPassword({token, values} ));
      if (updateUserPassword.fulfilled.match(result)) {
        toast.success(result.payload.message || "Password updated successfully!");
        closeModal();

        dispatch(handleLogout()).unwrap().then((res)=>{
          toast.success(res?.message || "Logout funally");
        }); // Assuming you have a logout action
      } else {
        toast.error(result.payload?.message || "Password update failed!");
      }
    },
  });
  const closeModal = () => {
    formik.resetForm();
    closeAllModals();
  };

  return (
    <div
      id="updateModal"
      className={`hs-overlay [--overlay-backdrop:static] ${
        openModal?.changePassword ? "open opened" : "hidden"
      } size-full fixed top-0 start-0 z-[80] overflow-x-hidden overflow-y-auto pointer-events-none`}
      role="dialog"
      tabIndex="-1"
      aria-labelledby="updateModal-label"
      data-hs-overlay-keyboard="false"
    >
      <div className="hs-overlay-animation-target hs-overlay-open:mt-7 hs-overlay-open:opacity-100 hs-overlay-open:duration-500 mt-0 opacity-0 ease-out transition-all max-w-xl xl:max-w-[600px] md:w-full m-6 sm:mx-auto min-h-[calc(100%-3.5rem)] flex items-center">
        <div className="flex flex-col bg-pattern bg-no-repeat bg-cover bg-center border shadow-sm rounded-[30px] pointer-events-auto w-full relative">
          <div className="w-full py-20 px-10">
            <div className="flex justify-between items-center max-w-[400px] mx-auto">
              <h3
                id="updateModal-label"
                className="uppercase text-dark-blue text-center w-full text-3xl xl:text-5xl mb-6"
              >
                Change Password
              </h3>
              <button
                type="button"
                onClick={closeModal}
                className="absolute top-5 right-5 size-9 inline-flex justify-center items-center rounded-full border border-transparent bg-dark-blue text-light-blue hover:bg-light-blue hover:text-dark-blue focus:outline-none focus:bg-light-blue focus:text-dark-blue disabled:opacity-50 disabled:pointer-events-none"
                aria-label="Close"
                data-hs-overlay="#updateModal"
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
                  <PasswordField
                    need_icon={true}
                    id="currentPassword"
                    name="currentPassword"
                    label="Current Password"
                    type="password"
                    placeholder=""
                    iconPlacement="right"
                    fieldValue={formik.values.currentPassword}
                    setFieldValue={formik.handleChange}
                    setFieldValueOnBlur={formik.handleBlur}
                  />
                  {formik.touched.currentPassword &&
                  formik.errors.currentPassword ? (
                    <div className="text-red-500 text-sm mt-1">
                      {formik.errors.currentPassword}
                    </div>
                  ) : null}
                </div>
                <div className="mb-5">
                  <PasswordField
                    need_icon={true}
                    id="newPassword"
                    name="newPassword"
                    label="New Password"
                    type="password"
                    placeholder=""
                    iconPlacement="right"
                    fieldValue={formik.values.newPassword}
                    setFieldValue={formik.handleChange}
                    setFieldValueOnBlur={formik.handleBlur}
                  />
                  {formik.touched.newPassword && formik.errors.newPassword ? (
                    <div className="text-red-500 text-sm mt-1">
                      {formik.errors.newPassword}
                    </div>
                  ) : null}
                </div>
                <div className="mb-5">
                  <PasswordField
                    need_icon={true}
                    id="confirmPassword"
                    name="confirmPassword"
                    label="Confirm Password"
                    type="password"
                    placeholder=""
                    iconPlacement="right"
                    fieldValue={formik.values.confirmPassword}
                    setFieldValue={formik.handleChange}
                    setFieldValueOnBlur={formik.handleBlur}
                  />
                  {formik.touched.confirmPassword &&
                  formik.errors.confirmPassword ? (
                    <div className="text-red-500 text-sm mt-1">
                      {formik.errors.confirmPassword}
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
                  Update Password
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangePasswordModal;
