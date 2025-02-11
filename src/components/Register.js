import React from 'react'
import Textfield from './Textfield'
import { Link } from 'react-router-dom'
import CountryDropdown from './CountryDropdown'
import { useFormik } from 'formik'
import * as YUP from "yup";
import axios from 'axios'

const registerUrl = `${process.env.REACT_APP_API_URL}/api/register`;

const Register = ({ openRegisterModal, setOpenRegisterModal }) => {
    const formik = useFormik({
        initialValues: {
            firstName: "",
            lastName: "",
            registerEmail: "",
            registerPassword: "",
            registerConfirmPassword: "",
            country: "",
            userAgreement: false,
        },
        validationSchema: YUP.object({
            firstName: YUP.string().min(2, "Firstname must be atleast 2 characters").required("First Name is required"),
            lastName: YUP.string().min(2, "Lastname must be atleast 2 characters").required("Last Name is required"),
            registerEmail: YUP.string().email('Invalid email format').required("Email is required"),
            registerPassword: YUP.string()
                .min(8, "Password must be at least 8 characters")
                .matches(/[a-z]/, "Must include at least one lowercase letter")
                .matches(/[A-Z]/, "Must include at least one uppercase letter")
                .matches(/\d/, "Must include at least one number")
                .matches(/[@$!%*?&]/, "Must include at least one special character (@$!%*?&)")
                .required("Password is required"),
            registerConfirmPassword: YUP.string()
                .oneOf([YUP.ref("registerPassword"), null], "Passwords must match")
                .required("Confirm Password is required"),
            country: YUP.string().required("Please select a country"),
            userAgreement: YUP.boolean().oneOf([true], "You must accept the terms and conditions")
        }),
        onSubmit: values => {
            alert(JSON.stringify(values, null, 2));
            handleRegister(values);
            closeModal('register');
        }
    });
    const handleRegister = async (values) => {
        // e.preventDefault();
        try {
            const response = await axios.post(registerUrl, {
                firstName: values?.firstName,
                lastName: values?.lastName,
                registerEmail: values?.registerEmail,
                registerPassword: values?.registerPassword,
                registerConfirmPassword: values?.registerConfirmPassword,
                country: values?.country,
                userAgreement: values?.userAgreement
            });
            return response.data;
        }
        catch (err) {
            console.error("Login failed:", err.response ? err.response.data : err.message);
        }
    }

    const closeModal = (backdrop) => {
        const backdropElement = document.querySelector(`#${backdrop}-backdrop`);
        if (backdropElement) {
            document.body.style.removeProperty("overflow");
            backdropElement.remove();
        } else {
            console.warn(`Element #${backdrop}-backdrop not found.`);
        }
        formik.resetForm();
        setOpenRegisterModal(false);
    }
    return (
        <>

            <div id="register" className={`hs-overlay [--overlay-backdrop:static] ${openRegisterModal ? 'open opened' : 'hidden'} size-full fixed top-0 start-0 z-[80] overflow-x-hidden overflow-y-auto pointer-events-none`} role="dialog" tabIndex="-1" aria-labelledby="register-label" data-hs-overlay-keyboard="false">
                <div className="hs-overlay-animation-target hs-overlay-open:mt-7 hs-overlay-open:opacity-100 hs-overlay-open:duration-500 mt-0 opacity-0 ease-out transition-all sm:max-w-2xl sm:w-full m-3 sm:mx-auto min-h-[calc(100%-3.5rem)] flex items-center" >
                    <div className="flex flex-col bg-pattern bg-no-repeat bg-cover bg-center border shadow-sm rounded-[30px] pointer-events-auto w-full relative">
                        <div className='w-full py-20 px-10'>
                            <div className="flex justify-between items-center">
                                <h3 id="register-label" className="uppercase text-dark-blue text-center w-full text-7xl mb-12">
                                    Join ZillioLinX for free now
                                </h3>
                                <button type="button"
                                    onClick={() => closeModal('register')}
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
                                        <Textfield id="firstName" name="firstName" fieldValue={formik.values.firstName} setFieldValue={formik.handleChange} setFieldValueOnBlur={formik.handleBlur} label="First Name" type="text" placeholder="" iconPlacement="left" />
                                        {formik.touched.firstName && formik.errors.firstName ? (
                                            <div className="text-red-500 text-sm mt-1">{formik.errors.firstName}</div>
                                        ) : null}
                                    </div>
                                    <div className="mb-5">
                                        <Textfield id="lastName" name="lastName" fieldValue={formik.values.lastName} setFieldValue={formik.handleChange} setFieldValueOnBlur={formik.handleBlur} label="Last Name" type="text" placeholder="" iconPlacement="left" />
                                        {formik.touched.lastName && formik.errors.lastName ? (
                                            <div className="text-red-500 text-sm mt-1">{formik.errors.lastName}</div>
                                        ) : null}
                                    </div>
                                    <div className="mb-5">
                                        <Textfield id="registerEmail" name="registerEmail" label="Email" type="email" placeholder="Enter email" iconPlacement="left" fieldValue={formik.values.registerEmail} setFieldValue={formik.handleChange} setFieldValueOnBlur={formik.handleBlur} />
                                        {formik.touched.registerEmail && formik.errors.registerEmail ? (
                                            <div className="text-red-500 text-sm mt-1">{formik.errors.registerEmail}</div>
                                        ) : null}
                                    </div>
                                    <div className="mb-5">
                                        <Textfield id="registerPassword" name="registerPassword" label="Password" type="password" placeholder="" iconPlacement="right" fieldValue={formik.values.registerPassword} setFieldValue={formik.handleChange} setFieldValueOnBlur={formik.handleBlur} />
                                        {formik.touched.registerPassword && formik.errors.registerPassword ? (
                                            <div className="text-red-500 text-sm mt-1">{formik.errors.registerPassword}</div>
                                        ) : null}
                                    </div>
                                    <div className="mb-5">
                                        <Textfield id="registerConfirmPassword" name="registerConfirmPassword" label="Confirm Password" type="password" placeholder="" iconPlacement="right" fieldValue={formik.values.registerConfirmPassword} setFieldValue={formik.handleChange} setFieldValueOnBlur={formik.handleBlur} />
                                        {formik.touched.registerConfirmPassword && formik.errors.registerConfirmPassword ? (
                                            <div className="text-red-500 text-sm mt-1">{formik.errors.registerConfirmPassword}</div>
                                        ) : null}
                                    </div>
                                    <div className="mb-5">
                                        <CountryDropdown fieldValue={formik.values.country} setFieldValue={formik.handleChange} />
                                        {formik.touched.country && formik.errors.country ? (
                                            <div className="text-red-500 text-sm mt-1">{formik.errors.country}</div>
                                        ) : null}
                                    </div>
                                    <div className="relative  mb-5">
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
                                    </div>
                                    <button type="submit" className="btn dark-btn w-full justify-center h-12">sign up</button>
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
                                {/* <div className="pt-7 pb-2 flex items-center text-xl text-light-black uppercase before:flex-1 before:border-t before:border-light-black before:me-6 after:flex-1 after:border-t after:border-light-black after:ms-6">Or</div>
                                <div className='text-xl text-light-black text-center'>
                                    <p className='uppercase'>Sign in with:</p>
                                    <div className='flex flex-wrap items-center justify-center my-4'>
                                        <button type="button" className="relative size-9 flex justify-center items-center text-sm font-semibold rounded-lg border border-transparent text-gray-800 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none dark:text-white dark:border-transparent dark:hover:bg-neutral-700 dark:focus:bg-neutral-700" aria-haspopup="dialog" aria-expanded="false" aria-controls="hs-header-base-offcanvas" aria-label="Toggle navigation" data-hs-overlay="#hs-header-base-offcanvas">
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className='size-6 shrink-0'>
                                                <g clipPath="url(#clip0_3_191)">
                                                    <path d="M12 0C5.37264 0 0 5.37264 0 12C0 17.6275 3.87456 22.3498 9.10128 23.6467V15.6672H6.62688V12H9.10128V10.4198C9.10128 6.33552 10.9498 4.4424 14.9597 4.4424C15.72 4.4424 17.0318 4.59168 17.5685 4.74048V8.06448C17.2853 8.03472 16.7933 8.01984 16.1822 8.01984C14.2147 8.01984 13.4544 8.76528 13.4544 10.703V12H17.3741L16.7006 15.6672H13.4544V23.9122C19.3963 23.1946 24.0005 18.1354 24.0005 12C24 5.37264 18.6274 0 12 0Z" fill="#2131E5" />
                                                </g>
                                                <defs>
                                                    <clipPath id="clip0_3_191">
                                                        <rect width="24" height="24" fill="white" />
                                                    </clipPath>
                                                </defs>
                                            </svg>
                                        </button>
                                        <button type="button" className="relative size-9 flex justify-center items-center text-sm font-semibold rounded-lg border border-transparent text-gray-800 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none dark:text-white dark:border-transparent dark:hover:bg-neutral-700 dark:focus:bg-neutral-700" aria-haspopup="dialog" aria-expanded="false" aria-controls="hs-header-base-offcanvas" aria-label="Toggle navigation" data-hs-overlay="#hs-header-base-offcanvas">
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className='size-6 shrink-0'>
                                                <path d="M18.3263 1.90391H21.6998L14.3297 10.3274L23 21.7899H16.2112L10.894 14.8379L4.80995 21.7899H1.43443L9.31744 12.78L1 1.90391H7.96111L12.7674 8.25824L18.3263 1.90391ZM17.1423 19.7707H19.0116L6.94539 3.81704H4.93946L17.1423 19.7707Z" fill="#2131E5" />
                                            </svg>
                                        </button>
                                        <button type="button" className="relative size-9 flex justify-center items-center text-sm font-semibold rounded-lg border border-transparent text-gray-800 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none dark:text-white dark:border-transparent dark:hover:bg-neutral-700 dark:focus:bg-neutral-700" aria-haspopup="dialog" aria-expanded="false" aria-controls="hs-header-base-offcanvas" aria-label="Toggle navigation" data-hs-overlay="#hs-header-base-offcanvas">
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className='size-6 shrink-0'>
                                                <g clipPath="url(#clip0_55_183)">
                                                    <path d="M11.9998 9.81815V14.4654H18.4579C18.1743 15.96 17.3233 17.2255 16.047 18.0764L19.9415 21.0982C22.2106 19.0037 23.5197 15.9273 23.5197 12.2728C23.5197 11.4219 23.4433 10.6037 23.3015 9.81828L11.9998 9.81815Z" fill="#2131E5" />
                                                    <path d="M5.27461 14.284L4.39625 14.9564L1.28711 17.3782C3.26165 21.2945 7.30862 24 11.9995 24C15.2394 24 17.9557 22.9309 19.9412 21.0982L16.0467 18.0764C14.9776 18.7964 13.614 19.2328 11.9995 19.2328C8.87951 19.2328 6.22868 17.1273 5.27952 14.2909L5.27461 14.284Z" fill="#2131E5" />
                                                    <path d="M1.28718 6.62182C0.469042 8.2363 0 10.0581 0 11.9999C0 13.9417 0.469042 15.7636 1.28718 17.378C1.28718 17.3889 5.27997 14.2799 5.27997 14.2799C5.03998 13.5599 4.89812 12.7963 4.89812 11.9998C4.89812 11.2033 5.03998 10.4397 5.27997 9.71975L1.28718 6.62182Z" fill="#2131E5" />
                                                    <path d="M11.9997 4.77818C13.767 4.77818 15.3379 5.38907 16.5925 6.56727L20.0288 3.13095C17.9452 1.18917 15.2398 0 11.9997 0C7.30887 0 3.26165 2.69454 1.28711 6.62183L5.27978 9.72001C6.22882 6.88362 8.87976 4.77818 11.9997 4.77818Z" fill="#2131E5" />
                                                </g>
                                                <defs>
                                                    <clipPath id="clip0_55_183">
                                                        <rect width="24" height="24" fill="white" />
                                                    </clipPath>
                                                </defs>
                                            </svg>
                                        </button>
                                    </div>
                                    <p className='mb-4'>Don't have an account? <Link to="#" className='hover:text-dark-blue'>Sign up</Link></p>
                                    <p><Link to="#" className='hover:text-dark-blue'>Forgot your password?</Link></p>
                                </div> */}
                            </div>
                        </div>

                    </div>
                </div>
            </div >
        </>
    )
}

export default Register