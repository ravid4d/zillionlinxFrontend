import React, { useEffect, useState } from "react";
import Textfield from "../elements/Textfield";
import { useFormik } from "formik";
import * as YUP from "yup";
import { toast } from "react-toastify";
import { handleRegister } from "../../redux/slices/registerSlice";
import { useDispatch, useSelector } from "react-redux";
import PasswordField from "../elements/PasswordField";
// import CountryDropdown from "../CountryDropdown";
import { Link, useNavigate } from "react-router-dom";
import Dropdown from "../elements/Dropdown";
import axios from "axios";
import { useGoogleLogin } from "@react-oauth/google";
import { handleGoogleLogin } from "../../redux/slices/authSlice";

const Register = ({ openModal, closeAllModals, setWhichModalOpen }) => {
  const [countries, setCountry] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.register);
  useEffect(() => {
    const getCountryList = async () => {
      let response = await axios.get(
        "https://valid.layercode.workers.dev/list/countries?format=select&flags=true&value=code"
      );
      setCountry(response?.data?.countries);
    };
    getCountryList();
  }, []);
  const formik = useFormik({
    initialValues: {
      first_name: "",
      last_name: "",
      email: "",
      password: "",
      password_confirmation: "",
      country: "US",
      terms_condition: false
    },
    validationSchema: YUP.object({
      first_name: YUP.string()
        .min(3, "First Name must be atleast 3 characters")
        .required("First Name is required"),
      last_name: YUP.string()
        .min(3, "Last Name must be atleast 3 characters")
        .required("Last Name is required"),
      email: YUP.string()
        .email("Invalid email format")
        .required("Email is required"),
      password: YUP.string()
        .min(8, "Password must be at least 8 characters")
        .max(16, "Password must not exceed 16 characters")
        .matches(/[a-z]/, "Must include at least one lowercase letter")
        .matches(/[A-Z]/, "Must include at least one uppercase letter")
        .matches(/\d/, "Must include at least one number")
        // .matches(/[@$!%*?&]/, "Must include at least one special character (@$!%*?&)")
        .required("Password is required"),
      password_confirmation: YUP.string()
        .oneOf([YUP.ref("password"), null], "Passwords must match")
        .required("Confirm Password is required"),
      country: YUP.string().required("Please select a country"),
      terms_condition: YUP.boolean().oneOf(
        [true],
        "You must accept the terms and conditions"
      )
    }),
    onSubmit: async (values) => {
      const result = await dispatch(handleRegister(values));
      if (handleRegister.fulfilled.match(result)) {
        toast.success(result.payload.message || "Registered successfully!");
        setWhichModalOpen("login");
      } else {
        toast.error(result.payload || "Register failed!");
      }
    }
  });
  const closeModal = () => {
    formik.resetForm();
    closeAllModals();
  };

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const accessToken = tokenResponse?.access_token;
        const result = await dispatch(
          handleGoogleLogin({ accessToken })
        ).unwrap();

        closeModal();
        navigate("/bookmarks", { state: { loginMessage: result?.message } });
      } catch (error) {
        toast.error(error?.message || "Login failed!");
        console.error("Error during login process:", error);
      }
    },
    onError: (error) => {
      toast.error(error?.message || "Login failed!");
      console.error("Google login failed:", error);
    }
  });
  const checkTerms = () => {
    formik.setErrors({...formik.errors, 'terms_condition':"You must accept the terms and conditions"});
  }
  
  return (
    <div
    id="register"
    className={`hs-overlay [--overlay-backdrop:static] ${
      openModal?.register ? "open opened" : "hidden"
    } size-full fixed top-0 start-0 z-[80] overflow-x-hidden overflow-y-auto pointer-events-none`}
    role="dialog"
    tabIndex="-1"
    aria-labelledby="register-label"
    data-hs-overlay-keyboard="false"
    >
      <div className="hs-overlay-animation-target hs-overlay-open:mt-7 hs-overlay-open:opacity-100 hs-overlay-open:duration-500 mt-0 opacity-0 ease-out transition-all max-w-xl xl:max-w-[600px] md:w-full m-6 sm:mx-auto min-h-[calc(100%-3.5rem)] flex items-center">
        <div className="flex flex-col bg-pattern bg-no-repeat bg-cover bg-center border shadow-sm rounded-[30px] pointer-events-auto w-full relative">
          <div className="w-full py-20 px-10">
            <div className="flex justify-between items-center max-w-[400px] mx-auto">
              <h3
                id="register-label"
                className="uppercase text-dark-blue text-center w-full text-3xl xl:text-5xl mb-6"
              >
                Join ZillioLinX <br />
                for free now
              </h3>
              <button
                type="button"
                onClick={closeModal}
                disabled={loading?.handleRegister}
                className={`${loading?.handleRegister ? 'disabled:bg-light-blue disabled:text-dark-blue disabled:pointer-events-none':''} absolute top-5 right-5 size-9 inline-flex justify-center items-center rounded-full border border-transparent bg-dark-blue text-light-blue hover:bg-light-blue hover:text-dark-blue focus:outline-none focus:bg-light-blue focus:text-dark-blue`}
                aria-label="Close"
                data-hs-overlay="#register"
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
              <form autoComplete="off" onSubmit={formik.handleSubmit}>
                <div className="mb-5">
                  <Textfield
                    id="first_name"
                    name="first_name"
                    // autoFocus={false}
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
                    id="last_name"
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
                    id="registerEmail"
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
                  <PasswordField
                    need_icon={true}
                    id="password"
                    setShowPassword={setShowPassword}
                    showPassword={showPassword}
                    name="password"
                    label="Password"
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
                    id="registerConfirmPassword"
                    name="password_confirmation"
                    label="Confirm Password"
                    type="password"
                    placeholder=""
                    iconPlacement="right"
                    fieldValue={formik.values.password_confirmation}
                    setFieldValue={formik.handleChange}
                    setFieldValueOnBlur={formik.handleBlur}
                  />
                  {formik.touched.password_confirmation &&
                  formik.errors.password_confirmation ? (
                    <div className="text-red-500 text-sm mt-1">
                      {formik.errors.password_confirmation}
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
                    formik={formik}
                    fieldValue={formik.values.country}
                    setFieldValue={(selectedOption) => {
                      formik.setFieldValue(
                        "country",
                        selectedOption?.value ? selectedOption?.value : ""
                      );
                    }}
                    items={countries ? countries : []}
                  />
                  {/* <CountryDropdown fieldValue={formik.values.country} setFieldValue={formik.handleChange} /> */}
                  {formik.touched.country && formik.errors.country ? (
                    <div className="text-red-500 text-sm mt-1">
                      {formik.errors.country}
                    </div>
                  ) : null}
                </div>
                <div className="relative  mb-5">
                  <div className="flex items-start">
                    <div className="flex items-center h-5 mt-0.5">
                      <input
                        id="terms_condition"
                        name="terms_condition"
                        type="checkbox"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        checked={formik.values.terms_condition}
                        className="bg-light-blue border-mid-blue size-5 rounded text-blue-600 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
                        aria-describedby="terms_condition-description"
                      />
                    </div>
                    <label htmlFor="terms_condition" className="ms-3">
                      <span className="block text-base text-light-black">
                        I have read and accept the{" "}
                        <Link
                          to="/user-agreement"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-dark-blue hover:underline inline-block"
                        >
                          User Agreement
                        </Link>{" "}
                        and
                        <Link
                          to="/privacy-policy"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-dark-blue hover:underline inline-block"
                        >
                          Privacy Policy
                        </Link>
                        .
                      </span>
                    </label>
                  </div>
                  {(formik.touched.terms_condition &&
                  formik.errors.terms_condition) || formik.errors.terms_condition ? (
                    <div className="text-red-500 text-sm mt-1">
                      {formik.errors.terms_condition}
                    </div>
                  ) : null}
                </div>
                <button
                  disabled={loading?.handleRegister}
                  type="submit"
                  className={`btn dark-btn w-full justify-center h-12 ${
                    loading?.handleRegister
                      ? "disabled:bg-light-blue disabled:text-dark-blue disabled:pointer-events-none"
                      : ""
                  }`}
                >
                  {loading?.handleRegister ? (
                    <span className="loader"></span>
                  ) : (
                    " Sign up"
                  )}
                </button>
                <button
                  type="button"
                  onClick={()=>{
                    if(formik.values.terms_condition) {
                      googleLogin();
                    }
                    else {
                      checkTerms();
                    }
                  }}
                  className={`mt-5 mx-auto relative flex justify-center items-center text-sm font-semibold rounded-lg border border-transparent text-gray-800 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none`}
                >
                  
                  <img src="/google-signup.png" alt="" width={200} height={46} />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
