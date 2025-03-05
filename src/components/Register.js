import React, { useState } from 'react'
import Textfield from './Textfield'
import { useFormik } from 'formik'
import * as YUP from "yup";
import { toast } from 'react-toastify';
import { handleRegister } from '../redux/slices/registerSlice'
import { useDispatch, useSelector } from 'react-redux';
import PasswordField from './PasswordField';

const Register = ({ openModal, closeAllModals}) => {
    const [showPassword, setShowPassword] = useState(false);
    const dispatch = useDispatch();
    const { loading } = useSelector((state) => state.register);
    const formik = useFormik({
        initialValues: {
            first_name: "",
            last_name: "",
            email: "",
            password: "",
            password_confirmation: "",
            // country: "",
            // userAgreement: false,
        },
        validationSchema: YUP.object({
            first_name: YUP.string().min(2, "First Name must be atleast 2 characters").required("First Name is required"),
            last_name: YUP.string().min(2, "Last Name must be atleast 2 characters").required("Last Name is required"),
            email: YUP.string().email('Invalid email format').required("Email is required"),
            password: YUP.string()
                .min(8, "Password must be at least 8 characters")
                .max(16, "Password must not exceed 12 characters")
                .matches(/[a-z]/, "Must include at least one lowercase letter")
                .matches(/[A-Z]/, "Must include at least one uppercase letter")
                .matches(/\d/, "Must include at least one number")
                // .matches(/[@$!%*?&]/, "Must include at least one special character (@$!%*?&)")
                .required("Password is required"),
            password_confirmation: YUP.string()
                .oneOf([YUP.ref("password"), null], "Passwords must match")
                .required("Confirm Password is required"),
            // country: YUP.string().required("Please select a country"),
            // userAgreement: YUP.boolean().oneOf([true], "You must accept the terms and conditions")
        }),
        onSubmit: async(values) => {
            const result = await dispatch(handleRegister(values));
            if (handleRegister.fulfilled.match(result)) {
                toast.success(result.payload.message || "Registered successfully!")
                closeModal();
              } else {
                toast.error(result.payload || "Register failed!");
              }
        }
    });
    const closeModal = () => {
        formik.resetForm();
        closeAllModals();
    }
    return (
        <>
            <div id="register" className={`hs-overlay [--overlay-backdrop:static] ${openModal?.register ? 'open opened' : 'hidden'} size-full fixed top-0 start-0 z-[80] overflow-x-hidden overflow-y-auto pointer-events-none`} role="dialog" tabIndex="-1" aria-labelledby="register-label" data-hs-overlay-keyboard="false">
                <div className="hs-overlay-animation-target hs-overlay-open:mt-7 hs-overlay-open:opacity-100 hs-overlay-open:duration-500 mt-0 opacity-0 ease-out transition-all sm:max-w-2xl sm:w-full m-3 sm:mx-auto min-h-[calc(100%-3.5rem)] flex items-center" >
                    <div className="flex flex-col bg-pattern bg-no-repeat bg-cover bg-center border shadow-sm rounded-[30px] pointer-events-auto w-full relative">
                        <div className='w-full py-20 px-10'>
                            <div className="flex justify-between items-center">
                                <h3 id="register-label" className="uppercase text-dark-blue text-center w-full text-7xl mb-12">
                                    Join ZillioLinX for free now
                                </h3>
                                <button type="button"
                                    onClick={closeModal}
                                    className="absolute top-5 right-5 size-9 inline-flex justify-center items-center rounded-full border border-transparent bg-dark-blue text-light-blue hover:bg-light-blue hover:text-dark-blue focus:outline-none focus:bg-light-blue focus:text-dark-blue disabled:opacity-50 disabled:pointer-events-none" aria-label="Close" data-hs-overlay="#register">
                                    <span className="sr-only">Close</span>
                                    <svg className="shrink-0 size-5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M18 6 6 18"></path>
                                        <path d="m6 6 12 12"></path>
                                    </svg>
                                </button>
                            </div>
                            <div className="max-w-[400px] mx-auto">
                                <form onSubmit={formik.handleSubmit}>
                                    <div className="mb-5">
                                        <Textfield id="first_name" name="first_name" icon="title" fieldValue={formik.values.first_name} setFieldValue={formik.handleChange} setFieldValueOnBlur={formik.handleBlur} label="First Name" type="text" placeholder="" iconPlacement="left" />
                                        {formik.touched.first_name && formik.errors.first_name ? (
                                            <div className="text-red-500 text-sm mt-1">{formik.errors.first_name}</div>
                                        ) : null}
                                    </div>
                                    <div className="mb-5">
                                        <Textfield id="last_name" name="last_name" icon="title" fieldValue={formik.values.last_name} setFieldValue={formik.handleChange} setFieldValueOnBlur={formik.handleBlur} label="Last Name" type="text" placeholder="" iconPlacement="left" />
                                        {formik.touched.last_name && formik.errors.last_name ? (
                                            <div className="text-red-500 text-sm mt-1">{formik.errors.last_name}</div>
                                        ) : null}
                                    </div>
                                    <div className="mb-5">
                                        <Textfield id="registerEmail" name="email" label="Email" type="email" iconPlacement="left" fieldValue={formik.values.email} setFieldValue={formik.handleChange} setFieldValueOnBlur={formik.handleBlur} />
                                        {formik.touched.email && formik.errors.email ? (
                                            <div className="text-red-500 text-sm mt-1">{formik.errors.email}</div>
                                        ) : null}
                                    </div>
                                    <div className="mb-5">
                                        <PasswordField id="registerPassword" setShowPassword={setShowPassword} showPassword={showPassword} name="password" label="Password" type="password" placeholder="" iconPlacement="right" fieldValue={formik.values.password} setFieldValue={formik.handleChange} setFieldValueOnBlur={formik.handleBlur} />
                                        {formik.touched.password && formik.errors.password ? (
                                            <div className="text-red-500 text-sm mt-1">{formik.errors.password}</div>
                                        ) : null}
                                    </div>
                                    <div className="mb-5">
                                        <PasswordField id="registerConfirmPassword" name="password_confirmation" label="Confirm Password" type="password" placeholder="" iconPlacement="right" fieldValue={formik.values.password_confirmation} setFieldValue={formik.handleChange} setFieldValueOnBlur={formik.handleBlur} />
                                        {formik.touched.password_confirmation && formik.errors.password_confirmation ? (
                                            <div className="text-red-500 text-sm mt-1">{formik.errors.password_confirmation}</div>
                                        ) : null}
                                    </div>
                                    {/* <div className="mb-5">
                                        <CountryDropdown fieldValue={formik.values.country} setFieldValue={formik.handleChange} /> */}
                                        {/* <CountryDropdown fieldValue={formik.values.country} setFieldValue={formik.handleChange} /> */}
                                        {/* {formik.touched.country && formik.errors.country ? (
                                            <div className="text-red-500 text-sm mt-1">{formik.errors.country}</div>
                                        ) : null} */}
                                    {/* </div> */}
                                    {/* <div className="relative  mb-5">
                                        <div className="flex items-start">
                                            <div className="flex items-center h-5 mt-0.5">
                                                <input id="userAgreement" name="userAgreement" type="checkbox"
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                    checked={formik.values.userAgreement}
                                                    className="bg-light-blue border-mid-blue size-5 rounded text-blue-600 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none" aria-describedby="userAgreement-description" />
                                            </div>
                                            <label htmlFor="userAgreement" className="ms-3">
                                                <span className="block text-md text-light-black">I have read and accept the User Agreement.</span>
                                            </label>
                                        </div>
                                        {formik.touched.userAgreement && formik.errors.userAgreement ? (
                                            <div className="text-red-500 text-sm mt-1">{formik.errors.userAgreement}</div>
                                        ) : null}
                                    </div> */}
                                    <button disabled={loading} type="submit" className={`btn dark-btn w-full justify-center h-12 ${loading ? 'disabled:bg-light-blue disabled:text-dark-blue disabled:pointer-events-none' : ''}`}>sign up</button>
                                    <button type="button" className="mt-2 w-full py-1.5 px-5 h-12 transition-all inline-flex justify-center items-center gap-x-2 text-lg font-medium rounded-xl border border-dark-blue bg-transparent uppercase text-dark-blue hover:bg-dark-blue hover:text-light-blue focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none">
                                        <svg className="w-4 h-auto" width="46" height="47" viewBox="0 0 46 47" fill="none">
                                            <path d="M46 24.0287C46 22.09 45.8533 20.68 45.5013 19.2112H23.4694V27.9356H36.4069C36.1429 30.1094 34.7347 33.37 31.5957 35.5731L31.5663 35.8669L38.5191 41.2719L38.9885 41.3306C43.4477 37.2181 46 31.1669 46 24.0287Z" fill="#4285F4"></path>
                                            <path d="M23.4694 47C29.8061 47 35.1161 44.9144 39.0179 41.3012L31.625 35.5437C29.6301 36.9244 26.9898 37.8937 23.4987 37.8937C17.2793 37.8937 12.0281 33.7812 10.1505 28.1412L9.88649 28.1706L2.61097 33.7812L2.52296 34.0456C6.36608 41.7125 14.287 47 23.4694 47Z" fill="#34A853"></path>
                                            <path d="M10.1212 28.1413C9.62245 26.6725 9.32908 25.1156 9.32908 23.5C9.32908 21.8844 9.62245 20.3275 10.0918 18.8588V18.5356L2.75765 12.8369L2.52296 12.9544C0.909439 16.1269 0 19.7106 0 23.5C0 27.2894 0.909439 30.8731 2.49362 34.0456L10.1212 28.1413Z" fill="#FBBC05"></path>
                                            <path d="M23.4694 9.07688C27.8699 9.07688 30.8622 10.9863 32.5344 12.5725L39.1645 6.11C35.0867 2.32063 29.8061 0 23.4694 0C14.287 0 6.36607 5.2875 2.49362 12.9544L10.0918 18.8588C11.9987 13.1894 17.25 9.07688 23.4694 9.07688Z" fill="#EB4335"></path>
                                        </svg>
                                        Sign up with Google
                                    </button>
                                </form>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </>
    )
}

export default Register