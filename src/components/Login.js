import React, { useState } from 'react';
import Textfield from './Textfield';
import { Link } from 'react-router-dom';
import { useFormik } from 'formik';
import axios from "axios";
import * as YUP from "yup";
import { toast } from 'react-toastify';
import { loginUser } from '../services/authService';

const loginUrl = `${process.env.REACT_APP_API_URL}/api/login`;

const Login = ({ setIsLoggedIn, openLoginModal, setOpenLoginModal, setOpenRegisterModal, setOpenForgotPasswordModal }) => {

    const formik = useFormik({
        initialValues: {
            type: "email",
            email: "",
            password: ""
        },
        validationSchema: YUP.object({
            email: YUP.string().email('Invalid email format').required("Email is required"),
            password: YUP.string()
                .required("Password is required"),
        }),
        onSubmit: values => {
            handleLogin(values);
        }
    });
    const handleLogin = async (values) => {
        try {
            const response = await axios.post(loginUrl, {
                type: "email",
                email: values?.email,
                password: values?.password,
            });
            toast.success(response?.data?.message);
            loginUser(response?.data?.data?.token);
            setIsLoggedIn(true);
            closeModal('hs-slide-down-animation-modal');
        }
        catch (err) {
            toast.error(err?.response?.data?.message);
        }
    }
    const closeModal = (backdrop) => {
        const backdropElement = document.querySelector(`#${backdrop}-backdrop`);
        if (backdropElement) {
            document.body.style.removeProperty("overflow");
            backdropElement.classList.add("opacity-0");
            setTimeout(() => {
                backdropElement.remove();
            }, 500)
        } else {
            console.warn(`Element #${backdrop}-backdrop not found.`);
        }
        formik.resetForm();
        setOpenLoginModal(false);
    }
    return (
        <div id="hs-slide-down-animation-modal" className={`hs-overlay [--overlay-backdrop:static] ${openLoginModal ? 'open opened' : 'hidden'} size-full fixed top-0 start-0 z-[80] overflow-x-hidden overflow-y-auto pointer-events-none`} role="dialog" tabIndex="-1" aria-labelledby="hs-slide-down-animation-modal-label" data-hs-overlay-keyboard="false">
            <div className="hs-overlay-animation-target hs-overlay-open:mt-7 hs-overlay-open:opacity-100 hs-overlay-open:duration-500 mt-0 opacity-0 ease-out transition-all sm:max-w-2xl sm:w-full m-3 sm:mx-auto min-h-[calc(100%-3.5rem)] flex items-center">
                <div className="flex flex-col bg-pattern bg-no-repeat bg-cover bg-center border shadow-sm rounded-[30px] pointer-events-auto w-full relative">
                    <div className='w-full py-20 px-10'>
                        <div className="flex justify-between items-center">
                            <h3 id="hs-slide-down-animation-modal-label" className="uppercase text-dark-blue text-center w-full text-7xl mb-12">
                                Login
                            </h3>
                            <button type="button"
                                onClick={() => closeModal('hs-slide-down-animation-modal')}
                                className="absolute top-5 right-5 size-9 inline-flex justify-center items-center rounded-full border border-transparent bg-dark-blue text-light-blue hover:bg-light-blue hover:text-dark-blue focus:outline-none focus:bg-light-blue focus:text-dark-blue disabled:opacity-50 disabled:pointer-events-none" aria-label="Close" data-hs-overlay="#hs-slide-down-animation-modal">
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
                                    <Textfield id="email" name="email" label="Email" type="email" placeholder="Enter email" iconPlacement="left" fieldValue={formik.values.email} setFieldValue={formik.handleChange} setFieldValueOnBlur={formik.handleBlur} />
                                    {formik.touched.email && formik.errors.email ? (
                                        <div className="text-red-500 text-sm mt-1">{formik.errors.email}</div>
                                    ) : null}
                                </div>
                                <div className="mb-5">
                                    <Textfield id="password" name="password" label="Password" type="password" placeholder="" iconPlacement="right" fieldValue={formik.values.password} setFieldValue={formik.handleChange} setFieldValueOnBlur={formik.handleBlur} />
                                    {formik.touched.password && formik.errors.password ? (
                                        <div className="text-red-500 text-sm mt-1">{formik.errors.password}</div>
                                    ) : null}
                                </div>
                                <button type="submit" className="btn dark-btn w-full justify-center h-12">login</button>
                            </form>
                            <div className="pt-7 pb-2 flex items-center text-xl text-light-black uppercase before:flex-1 before:border-t before:border-light-black before:me-6 after:flex-1 after:border-t after:border-light-black after:ms-6">Or</div>
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
                                <p className='mb-4'>Don't have an account? <span className="cursor-pointer hover:text-dark-blue" onClick={() => setOpenRegisterModal(true)}>Sign up</span></p>
                                <p><span onClick={() => setOpenForgotPasswordModal(true)} className='cursor-pointer hover:text-dark-blue'>Forgot your password?</span></p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div >
    )
}

export default Login