import React, { useState } from 'react';
import Textfield from './Textfield';
import { Link } from 'react-router-dom';
import { useFormik } from 'formik';
import axios from "axios";
import * as YUP from "yup";
import { toast } from 'react-toastify';
import { loginUser } from '../services/authService';
import CountryDropdown from './CountryDropdown';

const loginUrl = `${process.env.REACT_APP_API_URL}/api/login`;

const AddCategory = ({ openAddCategoryModal, setOpenAddCategoryModal }) => {

    const formik = useFormik({
        initialValues: {
            category_name: "",
            country: "",
        },
        validationSchema: YUP.object({
            category_name: YUP.string().required("Title is required"),
            country: YUP.string().required("Please select a country"),
        }),
        onSubmit: values => {
            handleLogin(values);
        }
    });
    const handleLogin = async (values) => {
        try {
            const response = await axios.post(loginUrl, {
                title: values?.title,
                country: values?.country,
            });
            toast.success(response?.data?.message);
            loginUser(response?.data?.data?.token);
            // setIsLoggedIn(true);
            closeModal('add-category-modal');
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
        setOpenAddCategoryModal(false);
    }
    return (
        <div id="add-category-modal" className={`hs-overlay [--overlay-backdrop:static] ${openAddCategoryModal ? 'open opened' : 'hidden'} size-full fixed top-0 start-0 z-[80] overflow-x-hidden overflow-y-auto pointer-events-none`} role="dialog" tabIndex="-1" aria-labelledby="add-category-modal-label" data-hs-overlay-keyboard="false">
            <div className="hs-overlay-animation-target hs-overlay-open:mt-7 hs-overlay-open:opacity-100 hs-overlay-open:duration-500 mt-0 opacity-0 ease-out transition-all sm:max-w-2xl sm:w-full m-3 sm:mx-auto min-h-[calc(100%-3.5rem)] flex items-center">
                <div className="flex flex-col bg-pattern bg-no-repeat bg-cover bg-center border shadow-sm rounded-[30px] pointer-events-auto w-full relative">
                    <div className='w-full py-20 px-10'>
                        <div className="flex justify-between items-center">
                            <h3 id="add-category-modal-label" className="uppercase text-dark-blue text-center w-full text-7xl mb-12">
                                Add Category
                            </h3>
                            <button type="button"
                                onClick={() => closeModal('add-category-modal')}
                                className="absolute top-5 right-5 size-9 inline-flex justify-center items-center rounded-full border border-transparent bg-dark-blue text-light-blue hover:bg-light-blue hover:text-dark-blue focus:outline-none focus:bg-light-blue focus:text-dark-blue disabled:opacity-50 disabled:pointer-events-none" aria-label="Close" data-hs-overlay="#add-category-modal">
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
                                    <Textfield id="category_name" name="category_name" label="Title" type="text" placeholder="Enter Category Name" iconPlacement="left" fieldValue={formik.values.category_name} setFieldValue={formik.handleChange} setFieldValueOnBlur={formik.handleBlur} icon="category" />
                                    {formik.touched.category_name && formik.errors.category_name ? (
                                        <div className="text-red-500 text-sm mt-1">{formik.errors.category_name}</div>
                                    ) : null}
                                </div>
                                <div className="mb-5">
                                    <CountryDropdown fieldValue={formik.values.country} setFieldValue={formik.handleChange} />
                                    {formik.touched.country && formik.errors.country ? (
                                        <div className="text-red-500 text-sm mt-1">{formik.errors.country}</div>
                                    ) : null}
                                </div>
                                <button type="submit" className="btn dark-btn w-full justify-center h-12">login</button>
                            </form>                            
                        </div>
                    </div>

                </div>
            </div>
        </div >
    )
}

export default AddCategory