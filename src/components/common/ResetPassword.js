import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import PasswordField from "../elements/PasswordField";
import { useDispatch, useSelector } from "react-redux";
import * as YUP from "yup";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import { handleResetPassword } from "../../redux/slices/registerSlice";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const email = searchParams.get("email");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { loading } = useSelector((state) => state.auth);

  const formik = useFormik({
    initialValues: {
      password: "",
      confirmPassword: "",
    },
    validationSchema: YUP.object({
      password: YUP.string()
        .min(8, "Password must be at least 8 characters")
        .max(16, "Password must not exceed 16 characters")
        .matches(/[a-z]/, "Must include at least one lowercase letter")
        .matches(/[A-Z]/, "Must include at least one uppercase letter")
        .matches(/\d/, "Must include at least one number")
        // .matches(/[@$!%*?&]/, "Must include at least one special character (@$!%*?&)")
        .required("New password is required"),
      confirmPassword: YUP.string()
        .oneOf([YUP.ref("password"), null], "Passwords must match")
        .required("Confirm Password is required"),
    }),
    onSubmit: async (values) => {
      try {
        const formValues = {
          email: email,
          token: token,
          password_confirmation: values.confirmPassword,
          password: values.password,
        };
        const result = await dispatch(handleResetPassword(formValues)).unwrap();
        
        navigate("/");
        toast.success(
          result.message || "Password reset successful! Redirecting..."
        );
      } catch (error) {
        console.error("Failed to reset password.", error);
        toast.error(error.message || "Failed to reset password.");
      }
    },
  });

  if (!token || !email) {
    return (
      <p className="text-center text-red-500">Invalid or expired reset link.</p>
    );
  }

  return (
    <div className="flex flex-col rounded-[30px] pointer-events-auto w-full relative h-screen flex-wrap items-center justify-center">
      <div className="w-full py-20 px-10">
        <div className="flex justify-between items-center max-w-xl xl:max-w-[600px] md:w-full m-6 sm:mx-auto">
          <h3
            id="hs-slide-down-animation-modal-label"
            className="uppercase text-dark-blue text-center w-full text-3xl xl:text-5xl mb-6"
          >
            Reset Password
          </h3>
        </div>
        <div className="max-w-[400px] mx-auto">
          <form onSubmit={formik.handleSubmit}>
            <div className="mb-5">
              <PasswordField
                need_icon={true}
                id="password"
                name="password"
                label="New Password"
                type="password"
                placeholder=""
                iconPlacement="right"
                fieldValue={formik.values.password}
                setFieldValue={formik.handleChange}
                setFieldValueOnBlur={formik.handleBlur}
              />
              {formik.touched.password && formik.errors.password ? (
                <div className="text-red-500 text-sm mt-1">
                  {formik.errors.password}
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
              Reset Password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
