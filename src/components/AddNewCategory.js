import React, { useEffect, useState } from 'react';
import Textfield from './Textfield';
import { useFormik } from 'formik';
import axios from "axios";
import * as YUP from "yup";
import { toast } from 'react-toastify';
import { getToken, loginUser } from '../services/authService';
import Dropdown from './Dropdown';

// const loginUrl = `${process.env.REACT_APP_API_URL}/api/login`;
const categoryUrl = `${process.env.REACT_APP_API_URL}/api/admin/categories`;

const AddNewCategory = ({  openModal, closeAllModals }) => {
    const [categories, setCategories] = useState([]);
    // Below ADMIN categories calling temporary
    useEffect(() => {
        let token = getToken();
        if(token) {
            getCategories();
        }
    }, []);

    const getCategories = async () => {
        try {
            const response = await axios.get(categoryUrl)
            // console.log(response?.data?.filter(category=>category?.parent_id===null), 'response');
            setCategories(response?.data?.filter(category=>category?.parent_id===null));
        }
        catch(error) {
            toast.error(error);
        }
    }

    const formik = useFormik({
        initialValues: {
            title: "",
            parent_id: "",
        },
        validationSchema: YUP.object({
            title: YUP.string()
            .max(25, "Category name must not exceed 25 characters")
            .matches(/^[A-Za-z\s&]+$/, "Only letters, spaces and & are allowed") // ✅ No digits, no special symbols
            .required("Category name is required"),
            parent_id: YUP.string()
            .nullable()
            .notRequired()
        }),
        onSubmit: values => {
            handleAddNewCategory(values);
        }
    });
    const handleAddNewCategory = async (values) => {
        try {
            const response = await axios.post(categoryUrl, {
                title: values?.title,
                parent_id: values?.parent_id,
            });
            toast.success(response?.data?.message);
            closeModal();
        }
        catch (err) {
            toast.error(err?.response?.data?.message);
        }
    }
    const closeModal = () => {
        formik.resetForm();
        closeAllModals();
    }
    return (
        <div id="add-category-modal" className={`hs-overlay [--overlay-backdrop:static] ${openModal?.newCategory ? 'open opened' : 'hidden'} size-full fixed top-0 start-0 z-[80] overflow-x-hidden overflow-y-auto pointer-events-none`} role="dialog" tabIndex="-1" aria-labelledby="add-category-modal-label" data-hs-overlay-keyboard="false">
            <div className="hs-overlay-animation-target hs-overlay-open:mt-7 hs-overlay-open:opacity-100 hs-overlay-open:duration-500 mt-0 opacity-0 ease-out transition-all sm:max-w-3xl sm:w-full m-3 sm:mx-auto min-h-[calc(100%-3.5rem)] flex items-center">
                <div className="flex flex-col bg-pattern bg-no-repeat bg-cover bg-center border shadow-sm rounded-[30px] pointer-events-auto w-full relative">
                    <div className='w-full py-20 px-10'>
                        <div className="flex justify-between items-center">
                            <h3 id="add-category-modal-label" className="uppercase text-dark-blue text-center w-full text-7xl mb-12">
                                Add Category
                            </h3>
                            <button type="button"
                                onClick={closeModal}
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
                                    <Textfield id="category_name" name="title" label="Title" type="text" placeholder="Enter Category Name" iconPlacement="left" fieldValue={formik.values.title} setFieldValue={formik.handleChange} setFieldValueOnBlur={formik.handleBlur} icon="category" />
                                    {formik.touched.title && formik.errors.title ? (
                                        <div className="text-red-500 text-sm mt-1">{formik.errors.title}</div>
                                    ) : null}
                                </div>
                                <div className="mb-5">
                                    <Dropdown id="parent_id" name="parent_id" label="Parent Category"  fieldValue={formik.values.parent_id} setFieldValue={(selectedOption) => formik.setFieldValue("parent_id", selectedOption?.value)} items={categories} />
                                    {formik.touched.parent_id && formik.errors.parent_id ? (
                                        <div className="text-red-500 text-sm mt-1">{formik.errors.parent_id}</div>
                                    ) : null}
                                </div>
                                <button type="submit" className="btn dark-btn w-full justify-center h-12">Add New Category</button>
                            </form>                            
                        </div>
                    </div>

                </div>
            </div>
        </div >
    )
}

export default AddNewCategory