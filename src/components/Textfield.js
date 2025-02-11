import React from 'react'

const Textfield = ({ label, type, id, name, placeholder, iconPlacement, fieldValue, setFieldValue, setFieldValueOnBlur }) => {
    return (
        <>
            <label htmlFor="input-label" className="block text-sm text-light-black mb-3">{label}</label>
            <div className="relative">
                <input
                    type={type}
                    id={id}
                    name={name}
                    className={`py-3 px-4 ${iconPlacement === "left" ? 'ps-11' : 'pe-11'} h-12 block bg-transparent w-full border-dark-blue rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500`}
                    placeholder={placeholder} autoFocus=""
                    // defaultValue={type === "password" ? "12345qwerty" : ""}
                    value={fieldValue}
                    onChange={setFieldValue}
                    onBlur={setFieldValueOnBlur}
                />
                {
                    type === "email" ?
                        <div className={`absolute inset-y-0 ${iconPlacement === "left" ? 'start-0 ps-4' : 'end-0 pe-4'} flex items-center pointer-events-none z-20`}>
                            <svg width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M8.46281 10.5212C8.31169 10.6157 8.14168 10.6535 7.99056 10.6535C7.83943 10.6535 7.66942 10.6157 7.5183 10.5212L0 5.93091V12.0324C0 13.3359 1.05785 14.3937 2.36128 14.3937H13.6387C14.9421 14.3937 16 13.3359 16 12.0324V5.93091L8.46281 10.5212Z" fill="#2131E5" />
                                <path d="M13.6386 2.60626H2.36115C1.24663 2.60626 0.302122 3.39965 0.0754395 4.4575L8.00932 9.29339L15.9243 4.4575C15.6976 3.39965 14.7531 2.60626 13.6386 2.60626Z" fill="#2131E5" />
                            </svg>
                        </div>
                        : type === "password" ?
                            <button type="button" data-hs-toggle-password={`{"target": "#${id}"}`} className="absolute inset-y-0 end-0 flex items-center z-20 px-3 cursor-pointer text-gray-400 rounded-e-md focus:outline-none focus:text-blue-600">
                                <svg className="shrink-0 size-3.5" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path className="hs-password-active:hidden" d="M9.88 9.88a3 3 0 1 0 4.24 4.24"></path>
                                    <path className="hs-password-active:hidden" d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"></path>
                                    <path className="hs-password-active:hidden" d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"></path>
                                    <line className="hs-password-active:hidden" x1="2" x2="22" y1="2" y2="22"></line>
                                    <path className="hidden hs-password-active:block" d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
                                    <circle className="hidden hs-password-active:block" cx="12" cy="12" r="3"></circle>
                                </svg>
                            </button>
                            : type === "text" ?
                                <div className={`absolute inset-y-0 ${iconPlacement === "left" ? 'start-0 ps-4' : 'end-0 pe-4'} flex items-center pointer-events-none z-20`}>
                                    <svg width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M13.4909 3.04544H2.50909C1.12727 3.04544 0 4.17271 0 5.55453V11.4636C0 12.8273 1.12727 13.9545 2.50909 13.9545H13.5091C14.8727 13.9545 16 12.8273 16 11.4454V5.55453C16 4.17271 14.8727 3.04544 13.4909 3.04544ZM9.58182 6.69999H12.3091C12.5818 6.69999 12.8182 6.91817 12.8182 7.20908C12.8182 7.49999 12.6 7.71817 12.3091 7.71817H9.58182C9.30909 7.71817 9.07273 7.49999 9.07273 7.20908C9.07273 6.91817 9.30909 6.69999 9.58182 6.69999ZM7.47273 8.49999C7.47273 9.93635 6.32727 11.1 4.89091 11.1C3.45455 11.1182 2.27273 9.95453 2.27273 8.51817C2.25455 7.0818 3.41818 5.89999 4.85455 5.89999C6.29091 5.8818 7.45455 7.04544 7.47273 8.4818V8.49999ZM12.5091 10.3H9.58182C9.30909 10.3 9.07273 10.0818 9.07273 9.79089C9.07273 9.49999 9.29091 9.2818 9.58182 9.2818H12.5091C12.7818 9.2818 13.0182 9.49999 13.0182 9.79089C13.0182 10.0818 12.7818 10.3 12.5091 10.3Z" fill="#2131E5" />
                                    </svg>
                                </div> : null
                }
            </div>
        </>
    )
}

export default Textfield