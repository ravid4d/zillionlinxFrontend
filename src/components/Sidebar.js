import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { toast } from 'react-toastify';
import { getToken} from "../services/authService";
const categoryUrl = `${process.env.REACT_APP_API_URL}/api/categories`;

const Sidebar = () => {
    const [openAccordion, setOpenAccordion] = useState({});
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        let token = getToken();
        getCategories(token);
    }, []);

    const toggleAccordion = (id, hasDropdown) => {
        if (!hasDropdown) return;
        setOpenAccordion((prevId) => (prevId === id ? null : id));
    };    

    const getCategories = async (token) => {
        try {
            const response = await axios.get(categoryUrl, 
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                }
            );
            setCategories(response?.data);
        }
        catch(error) {
            toast.error(error);
        }
    }
    return (
        <div className='rounded-2xl bg-white lg:p-6 min-h-[calc(100vh-130px)] relative h-[calc(100%-64px)]'>

            <div className='min-h-4/6 h-[50vh] '>
                <p className='text-[28px] text-dark-blue capitalize mb-5'>My Bookmarks</p>
                <ul className='rounded-xl border border-light-blue p-4 min-h-4/6 h-full bookmark-sidebar custom-scrollbar overflow-x-hidden overflow-y-auto'>
                    {
                        categories && categories?.length > 0 && categories?.map((category, index) => {
                            const hasDropdown = category?.subcategories?.length>0;
                            const isActive = openAccordion === `users-accordion_${index}`;
                            return (
                                <li key={index} className={`${isActive ? "active" : ""
                                    } hs-accordion-group hs-accordion last:mb-0 relative`} id={`users-accordion_${index}`}>
                                    <button
                                       
                                        type="button" className={`rounded-lg bg-lighter-blue mb-2 py-1.5 px-2.5 flex flex-wrap items-center space-x-2 text-base text-light-black w-full focus:outline-none ${isActive ? "" : ""
                                            }`}
                                        aria-expanded={isActive}
                                        aria-controls={`users-accordion-collapse-${index}`}>

                                        <svg  onClick={() => toggleAccordion(`users-accordion_${index}`, hasDropdown)} width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className='hs-accordion-toggle'>
                                            <path d="M8.00037 14.9584C11.8434 14.9584 14.9587 11.843 14.9587 8C14.9587 4.157 11.8434 1.04163 8.00037 1.04163C4.15736 1.04163 1.04199 4.157 1.04199 8C1.04199 11.843 4.15736 14.9584 8.00037 14.9584Z" stroke="#2131E5" strokeWidth="0.625" strokeMiterlimit="10" strokeLinecap="round" className='circle' />
                                            <path d="M8 4.1875V11.8125" stroke="#2131E5" strokeWidth="0.625" strokeMiterlimit="10" strokeLinecap="round" className='plus' />
                                            <path d="M4.1875 8H11.8125" stroke="#2131E5" strokeWidth="0.625" strokeMiterlimit="10" strokeLinecap="round" className='minus' />
                                        </svg>

                                        <span>{category?.title}</span>
                                    </button>
                                    {
                                        hasDropdown &&
                                        <div id={`users-accordion-collapse-${index}`} className={`hs-accordion-content w-full overflow-hidden transition-[height] duration-300 ${isActive ? "block" : "hidden"
                                            }`} role="region" aria-labelledby={`users-accordion_${index}`}>
                                            <ul className="pt-1 ps-7 space-y-1">
                                                {
                                                    category?.subcategories?.map((subCat, subIndex) => {
                                                        return (
                                                            <li className="hs-accordion-group hs-accordion relative" id={`users-accordion-sub-${subIndex}`} key={subIndex}>
                                                                <button type="button" className="rounded-lg bg-lighter-blue mb-2 py-1.5 px-2.5 flex flex-wrap items-center space-x-2 text-base text-light-black w-full focus:outline-none" aria-expanded="true" aria-controls="users-accordion-sub-1-collapse-1">
                                                                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className='hs-accordion-toggle'>
                                                                        <path d="M8.00037 14.9584C11.8434 14.9584 14.9587 11.843 14.9587 8C14.9587 4.157 11.8434 1.04163 8.00037 1.04163C4.15736 1.04163 1.04199 4.157 1.04199 8C1.04199 11.843 4.15736 14.9584 8.00037 14.9584Z" stroke="#2131E5" strokeWidth="0.625" strokeMiterlimit="10" strokeLinecap="round" className='circle' />
                                                                        <path d="M8 4.1875V11.8125" stroke="#2131E5" strokeWidth="0.625" strokeMiterlimit="10" strokeLinecap="round" />
                                                                        <path d="M4.1875 8H11.8125" stroke="#2131E5" strokeWidth="0.625" strokeMiterlimit="10" strokeLinecap="round" />
                                                                    </svg>
                                                                    <span>{subCat?.title}</span>
                                                                </button>
                                                            </li>
                                                        )
                                                    })
                                                }
                                            </ul>
                                        </div>

                                    }
                                </li>
                            )
                        })
                    }
                </ul>
            </div>
            <div className='bg-dark-blue rounded-xl text-xl text-white gap-2 items-center pl-[120px] py-2 pr-3 absolute bottom-0 lg:bottom-8 lg:left-6 lg:right-6 mx-auto'>
                <div className='absolute left-2 top-2 w-[85px]'>
                    <img src="/search-bookmark-icon.png" alt="" className="w-full" />
                </div>
                <div className=''>
                    Search for Pre-populated Bookmark Collections.
                </div>
            </div>
        </div>
    )
}

export default Sidebar