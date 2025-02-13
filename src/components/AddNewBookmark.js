import React from 'react'
import Textfield from './Textfield'
import { useFormik } from 'formik';
import axios from "axios";
import * as YUP from "yup";

const addNewBookmarkUrl = `${process.env.REACT_APP_API_URL}/api/addNewBookmark`;

const AddNewBookmark = ({ openAddNewBookmarkModal, setOpenAddNewBookmarkModal, btnRef }) => {
    const formik = useFormik({
        initialValues: {
            title: "",
            website: "",
            category: "",
            subcategory: "",
            addTo: ""
        },
        validationSchema: YUP.object({
            title: YUP.string()
                .required("Title is required")
                .min(3, "Must be at least 3 characters")
                .max(50, "Cannot exceed 50 characters"),
            website: YUP.string()
                .url("Invalid URL format")
                .required("URL is required"),
            category: YUP.string()
                .required("Category is required")
                .min(3, "Must be at least 3 characters")
                .max(50, "Cannot exceed 50 characters"),
            subcategory: YUP.string()
                .required("Sub Category is required")
                .min(3, "Must be at least 3 characters")
                .max(50, "Cannot exceed 50 characters"),
            addTo: YUP.string()
                .required("Add To is required"),
        }),
        onSubmit: values => {
            alert(JSON.stringify(values, null, 2));
            handleAddNewBookmark(values);
            closeModal('add-new-bookmark-modal');
        }
    });
    const handleAddNewBookmark = async (values) => {
        try {
            const response = await axios.post(addNewBookmarkUrl, {
                title: values?.title,
                website: values?.website,
                category: values?.category,
                subcategory: values?.subcategory,
                addTo: values?.addTo
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
            backdropElement.classList.add = "opacity-0"
            setTimeout(() => {
                backdropElement.remove();
            }, 500)
        } else {
            console.warn(`Element #${backdrop}-backdrop not found.`);
        }
        formik.resetForm();
        setOpenAddNewBookmarkModal(false);
    }
    return (
        <>
            <button type="button" ref={btnRef} className="add-new-bookmark-btn hidden py-3 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none" aria-haspopup="dialog" aria-expanded="false" aria-controls="add-new-bookmark-modal" data-hs-overlay="#add-new-bookmark-modal">
                Open Add New Bookmark
            </button>

            <div id="add-new-bookmark-modal" className={`hs-overlay ${openAddNewBookmarkModal ? 'open opened' : 'hidden'} size-full fixed top-0 start-0 z-[80] overflow-x-hidden overflow-y-auto pointer-events-none`} role="dialog" tabIndex="-1" aria-labelledby="add-new-bookmark-modal-label">
                <div className="hs-overlay-animation-target hs-overlay-open:mt-7 hs-overlay-open:opacity-100 hs-overlay-open:duration-500 mt-0 opacity-0 ease-out transition-all sm:max-w-2xl sm:w-full m-3 sm:mx-auto">
                    <div className="flex flex-col bg-pattern bg-no-repeat bg-cover bg-center border shadow-sm rounded-[30px] pointer-events-auto w-full relative">
                        <div className='w-full py-20 px-10'>
                            <div className="flex justify-between items-center">
                                <h3 id="add-new-bookmark-modal-label" className="uppercase text-dark-blue text-center w-full text-7xl mb-12">
                                    Add New Bookmark
                                </h3>
                                <button type="button"
                                    className="absolute top-5 right-5 size-9 inline-flex justify-center items-center rounded-full border border-transparent bg-dark-blue text-light-blue hover:bg-light-blue hover:text-dark-blue focus:outline-none focus:bg-light-blue focus:text-dark-blue disabled:opacity-50 disabled:pointer-events-none" aria-label="Close" data-hs-overlay="#add-new-bookmark-modal">
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
                                        <Textfield id="title" name="title" label="Title" type="text" placeholder="" icon="title" iconPlacement="left" fieldValue={formik.values.title} setFieldValue={formik.handleChange} setFieldValueOnBlur={formik.handleBlur} />
                                        {formik.touched.title && formik.errors.title ? (
                                            <div className="text-red-500 text-sm mt-1">{formik.errors.title}</div>
                                        ) : null}
                                    </div>
                                    <div className="mb-5">
                                        <Textfield id="website" name="website" label="Website" type="url" placeholder="" icon="url" iconPlacement="left" fieldValue={formik.values.website} setFieldValue={formik.handleChange} setFieldValueOnBlur={formik.handleBlur} />
                                        {formik.touched.website && formik.errors.website ? (
                                            <div className="text-red-500 text-sm mt-1">{formik.errors.website}</div>
                                        ) : null}
                                    </div>
                                    <div className="mb-5">
                                        <Textfield id="category" name="category" label="Category" type="text" placeholder="" icon="category" iconPlacement="left" fieldValue={formik.values.category} setFieldValue={formik.handleChange} setFieldValueOnBlur={formik.handleBlur} />
                                        {formik.touched.category && formik.errors.category ? (
                                            <div className="text-red-500 text-sm mt-1">{formik.errors.category}</div>
                                        ) : null}
                                    </div>
                                    <div className="mb-5">
                                        <Textfield id="subcategory" name="subcategory" label="Sub Category" type="text" placeholder="" icon='category' iconPlacement="left" fieldValue={formik.values.subcategory} setFieldValue={formik.handleChange} setFieldValueOnBlur={formik.handleBlur} />
                                        {formik.touched.subcategory && formik.errors.subcategory ? (
                                            <div className="text-red-500 text-sm mt-1">{formik.errors.subcategory}</div>
                                        ) : null}
                                    </div>
                                    <div className="mb-5">
                                        <label htmlFor="addTo" className="block text-sm text-light-black mb-3">Add To?</label>
                                        <div className="flex gap-x-6">
                                            <div className="flex">
                                                <input
                                                    type="radio"
                                                    name="addTo"
                                                    value="bookmarks"
                                                    checked={formik.values.addTo === "bookmarks"}
                                                    onChange={formik.handleChange}
                                                    className="bg-transparent shrink-0 mt-0.5 border-dark-blue rounded-full text-blue-600 focus:ring-dark-blue disabled:opacity-50 disabled:pointer-events-none"
                                                    id="bookmarks" />
                                                <label htmlFor="bookmarks" className="text-sm text-gray-500 ms-2">Bookmarks</label>
                                            </div>

                                            <div className="flex">
                                                <input type="radio" name="addTo"
                                                    checked={formik.values.addTo === "topLinks"}
                                                    value="topLinks"
                                                    onChange={formik.handleChange}
                                                    className="bg-transparent checked:bg-dark-blue shrink-0 mt-0.5 border-dark-blue rounded-full text-blue-600 focus:ring-dark-blue disabled:opacity-50 disabled:pointer-events-none" id="topLinks" />
                                                <label htmlFor="topLinks" className="text-sm text-gray-500 ms-2">Top Links</label>
                                            </div>
                                        </div>

                                        {formik.touched.addTo && formik.errors.addTo ? (
                                            <div className="text-red-500 text-sm mt-1">{formik.errors.addTo}</div>
                                        ) : null}
                                    </div>
                                    <div className='grid grid-cols-2 gap-4'>
                                        <button type="submit" className="btn dark-btn w-full justify-center h-12">Done</button>
                                        <button type="button" className="btn light-btn w-full justify-center h-12">Cancel</button>
                                    </div>
                                </form>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

        </>
    )
}

export default AddNewBookmark