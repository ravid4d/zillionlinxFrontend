import React, { useState } from 'react';
import Textfield from '../elements/Textfield';
import { useFormik } from 'formik';
import * as YUP from "yup";
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { handleGoogleLogin, handleLogin } from '../../redux/slices/authSlice';
import { useNavigate } from 'react-router-dom';
import PasswordField from '../elements/PasswordField';
import { useGoogleLogin } from '@react-oauth/google';

// import CryptoJS from "crypto-js";

const Login = ({ openModal, setWhichModalOpen, closeAllModals }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    const [showPassword, setShowPassword] = useState(false);
    
    const { loading } = useSelector((state) => state.auth);

    // const encryptPassword = (password) => {
    //     return CryptoJS.AES.encrypt(password, process.env.REACT_APP_SECRET_CODE).toString();
    // }; 

    const formik = useFormik({
        initialValues: {
            email: "",
            password: "",
            remember_me: false
        },
        validationSchema: YUP.object({
            email: YUP.string().email('Invalid email format').required("Email is required"),
            password: YUP.string()
                .required("Password is required"),
        }),
        onSubmit: async(values) => {
            let loginType="user";
            // const encryptedPassword = encryptPassword(values?.password);
            // values.password=encryptedPassword;
            try {
                const result = await dispatch(handleLogin({ values, loginType })).unwrap();
                if(!result?.isLoggedIn) {
                    toast.error(result?.message)
                }
                else {
                    // toast.success(result?.message)
                    closeModal();    
                    //Pass state to show login successfull toast in mybookmarks page.
                    navigate('/bookmarks', {state:{loginMessage:result?.message}})
                }
            } catch (error) {
                toast.error(error?.message || "Login failed!");
            }
        }
    });
    
    const closeModal = () => {
        formik.resetForm();
        closeAllModals();
    }
  
    const googleLogin = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            try {
                const accessToken = tokenResponse?.access_token;
                const result = await dispatch(handleGoogleLogin({ accessToken })).unwrap();
                console.log('Login successful:', result);

                closeModal();    
                navigate('/bookmarks', {state:{loginMessage:result?.message}})

            } catch (error) {
                toast.error(error?.message || "Login failed!");
                console.error('Error during login process:', error);
            }
        },
        onError: (error) => {
            toast.error(error?.message || "Login failed!");
            console.error('Google login failed:', error);
        },
    });

      
     
    return (
        <div id="hs-slide-down-animation-modal" className={`hs-overlay [--overlay-backdrop:static] ${openModal?.login ? 'open opened' : 'hidden'} size-full fixed top-0 start-0 z-[80] overflow-x-hidden overflow-y-auto pointer-events-none`} role="dialog" tabIndex="-1" aria-labelledby="hs-slide-down-animation-modal-label" data-hs-overlay-keyboard="false">
            <div className="hs-overlay-animation-target hs-overlay-open:mt-7 hs-overlay-open:opacity-100 hs-overlay-open:duration-500 mt-0 opacity-0 ease-out transition-all max-w-xl xl:max-w-[600px] md:w-full m-6 sm:mx-auto min-h-[calc(100%-3.5rem)] flex items-center">
                <div className="flex flex-col bg-pattern bg-no-repeat bg-cover bg-center border shadow-sm rounded-[30px] pointer-events-auto w-full relative">
                    <div className='w-full py-20 px-10'>
                        <div className="flex justify-between items-center flex-col max-w-[400px] mx-auto">
                        {/* <div className='w-full text-red-600'>{error}</div> */}
                            <h3 id="hs-slide-down-animation-modal-label" className="uppercase text-dark-blue text-center w-full text-3xl xl:text-5xl mb-6">
                                Login
                            </h3>
                            <button type="button"
                                onClick={closeModal}
                                disabled={loading&&'disabled'}
                                className={`${loading?'disabled:opacity-50 disabled:pointer-events-none':'hover:bg-light-blue hover:text-dark-blue'} absolute top-5 right-5 size-9 inline-flex justify-center items-center rounded-full border border-transparent bg-dark-blue text-light-blue focus:outline-none focus:bg-light-blue focus:text-dark-blue" aria-label="Close" data-hs-overlay="#hs-slide-down-animation-modal`}>
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
                                    <Textfield autoFocus={false} id="email" name="email" label="Email" type="email" placeholder="Enter email" iconPlacement="left" fieldValue={formik.values.email} setFieldValue={formik.handleChange} setFieldValueOnBlur={formik.handleBlur} />
                                    {formik.touched.email && formik.errors.email ? (
                                        <div className="text-red-500 text-sm mt-1">{formik.errors.email}</div>
                                    ) : null}
                                </div>
                                <div className="mb-5">
                                    <PasswordField need_icon={true} id="password" setShowPassword={setShowPassword} showPassword={showPassword} name="password" label="Password" type="password" placeholder="" iconPlacement="right" fieldValue={formik.values.password} setFieldValue={formik.handleChange} setFieldValueOnBlur={formik.handleBlur} />
                                    {formik.touched.password && formik.errors.password ? (
                                        <div className="text-red-500 text-sm mt-1">{formik.errors.password}</div>
                                    ) : null}
                                </div>
                                <div className="mb-5 flex items-center gap-2">
                                    <label htmlFor="remember_me" className="relative inline-block w-11 h-6 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            id="remember_me"
                                            name="remember_me"
                                            onChange={formik.handleChange}
                                            checked={formik.values.remember_me}
                                            className="peer sr-only"
                                        />
                                        <span className="absolute inset-0 bg-gray-200 rounded-full transition-colors duration-200 ease-in-out peer-checked:bg-blue-600 dark:bg-neutral-700 dark:peer-checked:bg-blue-500 peer-disabled:opacity-50 peer-disabled:pointer-events-none"></span>
                                        <span className="absolute top-1/2 left-0.5 -translate-y-1/2 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200 ease-in-out peer-checked:translate-x-full dark:bg-neutral-400 dark:peer-checked:bg-white"></span>
                                    </label>
                                    <label htmlFor="remember_me" className="cursor-pointer text-sm text-gray-700 dark:text-white">
                                        Remember me for 10 days.
                                    </label>
                                </div>
                                <button disabled={loading} type="submit" className={`btn dark-btn w-full justify-center h-12 ${loading ? 'disabled:bg-light-blue disabled:text-dark-blue disabled:pointer-events-none' : ''}`}>login</button>
                            </form>
                            <div className="pt-7 pb-2 flex items-center text-lg text-light-black uppercase before:flex-1 before:border-t before:border-light-black before:me-6 after:flex-1 after:border-t after:border-light-black after:ms-6">Or</div>
                            <div className='text-base xl:text-lg text-light-black text-center'>
                                <p className='uppercase'>Sign in with:</p>
                                <div className='flex flex-wrap items-center justify-center my-4'>
                                    <button type="button" onClick={() => googleLogin()}  className={`relative size-9 flex justify-center items-center text-sm font-semibold rounded-lg border border-transparent text-gray-800 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none `} aria-haspopup="dialog" aria-expanded="false" aria-controls="hs-header-base-offcanvas" aria-label="Toggle navigation" data-hs-overlay="#hs-header-base-offcanvas">
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
                                <p className='mb-2'>Don't have an account? <span className="cursor-pointer hover:text-dark-blue" onClick={() => setWhichModalOpen('register')}>Sign up</span></p>
                                <p><span onClick={() => setWhichModalOpen('forgot')} className='cursor-pointer hover:text-dark-blue'>Forgot your password?</span></p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div >
    )
}

export default Login