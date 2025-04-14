import React from "react";
import PasswordField from "../elements/PasswordField";
import { useFormik } from "formik";
import * as YUP from "yup";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { updateAdminPassword } from "../../redux/slices/userSlice";
import { logout } from "../../redux/slices/authSlice";

const ChangePassword = () => {
  const dispatch = useDispatch();

  const { loading } = useSelector((state) => state.user);
  const { token } = useSelector((state) => state.auth);

  const formik = useFormik({
    initialValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: ""
    },
    validationSchema: YUP.object({
      currentPassword: YUP.string().required("Current password is required"),
      newPassword: YUP.string()
        .min(8, "Password must be at least 8 characters")
        .max(16, "Password must not exceed 16 characters")
        .matches(/[a-z]/, "Must include at least one lowercase letter")
        .matches(/[A-Z]/, "Must include at least one uppercase letter")
        .matches(/\d/, "Must include at least one number")
        .required("New password is required"),
      confirmPassword: YUP.string()
        .oneOf([YUP.ref("newPassword"), null], "Passwords must match")
        .required("Confirm Password is required")
    }),
    onSubmit: async (values) => {
      const result = await dispatch(updateAdminPassword({ token, values }));
      if (updateAdminPassword.fulfilled.match(result)) {
        toast.success(
          result.payload.message || "Password updated successfully!"
        );
        dispatch(logout());
      } else {
        toast.error(result.payload?.message || "Password update failed!");
      }
    }
  });
  return (
    <div className="w-full lg:ps-64">
      <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
        <div className="bg-white border border-gray-200 overflow-x-auto rounded-xl shadow-2xs overflow-hidden dark:bg-neutral-800 dark:border-neutral-700">
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm dark:bg-neutral-800 dark:border-neutral-700">
            <div className="px-6 py-4 grid gap-3 md:flex md:justify-between md:items-center border-b border-gray-200 dark:border-neutral-700">
              <div>
                <h2 className="text-xl font-semibold text-gray-800 dark:text-neutral-200">
                  Change Password
                </h2>
                <p className="text-sm text-gray-600 dark:text-neutral-400">
                  Update password by passing current and new one.
                </p>
              </div>
            </div>
            <form
              onSubmit={formik.handleSubmit}
              className="flex flex-wrap flex-col p-6 rounded-md bg-white shadow-admin w-full"
            >
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
              <div>
                <button
                  disabled={loading}
                  type="submit"
                  className={`btn dark-btn justify-center h-12 ${
                    loading
                      ? "disabled:bg-light-blue disabled:text-dark-blue disabled:pointer-events-none"
                      : ""
                  }`}
                >
                  Update Password
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
