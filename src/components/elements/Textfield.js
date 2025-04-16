import React, { forwardRef, useEffect, useRef } from 'react'

const Textfield = forwardRef(({ label, type, id, icon = "", name, placeholder = "", iconPlacement, fieldValue, setFieldValue, setFieldValueOnBlur,autoFocus, readOnly=false }, ref) => {
    const inputRef = useRef(null);
    useEffect(() => {
        if (autoFocus && inputRef.current) {
          inputRef.current.focus();  // Focus the input if autoFocus is true
        }
      }, [autoFocus]);
    
    return (
        <>
            <label htmlFor={id} className="block text-base text-light-black mb-3">{label}</label>
            <div className="relative">
                <input
                    type={type}
                    id={id}
                    name={name}
                    className={`py-3 px-4 ${iconPlacement === "left" ? 'ps-11' : 'pe-11'} h-12 block bg-transparent w-full border-dark-blue rounded-lg text-md focus:border-blue-500 focus:ring-blue-500`}
                    placeholder={placeholder} 
                    value={fieldValue}
                    onChange={setFieldValue}
                    onBlur={setFieldValueOnBlur}
                    tabIndex={0}
                    ref={ref || inputRef}
                    autoFocus={autoFocus}
                    readOnly={readOnly}
                    {...(type === "password" && { autoComplete: "new-password" })}
                />
                {
                    type === "email" ?
                        <div className={`absolute inset-y-0 ${iconPlacement === "left" ? 'start-0 ps-4' : 'end-0 pe-4'} flex items-center pointer-events-none z-20`}>
                            <svg width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M8.46281 10.5212C8.31169 10.6157 8.14168 10.6535 7.99056 10.6535C7.83943 10.6535 7.66942 10.6157 7.5183 10.5212L0 5.93091V12.0324C0 13.3359 1.05785 14.3937 2.36128 14.3937H13.6387C14.9421 14.3937 16 13.3359 16 12.0324V5.93091L8.46281 10.5212Z" fill="#2131E5" />
                                <path d="M13.6386 2.60626H2.36115C1.24663 2.60626 0.302122 3.39965 0.0754395 4.4575L8.00932 9.29339L15.9243 4.4575C15.6976 3.39965 14.7531 2.60626 13.6386 2.60626Z" fill="#2131E5" />
                            </svg>
                        </div>
                        : null
                }
                {
                    icon === "url" ?
                        <div className={`absolute inset-y-0 ${iconPlacement === "left" ? 'start-0 ps-4' : 'end-0 pe-4'} flex items-center pointer-events-none z-20`}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="#2131E5" className='size-4'>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
                            </svg>
                        </div>
                        : null
                }
                {
                    (icon === "category" || icon === "subcategory") ?
                        <div className={`absolute inset-y-0 ${iconPlacement === "left" ? 'start-0 ps-4' : 'end-0 pe-4'} flex items-center pointer-events-none z-20`}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="#2131E5" className="size-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 0 0 5.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 0 0 9.568 3Z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6Z" />
                            </svg>
                        </div>
                        : null
                }
                {
                    icon === "title" ?
                        <div className={`absolute inset-y-0 ${iconPlacement === "left" ? 'start-0 ps-4' : 'end-0 pe-4'} flex items-center pointer-events-none z-20`}>
                            <svg width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M13.4909 3.04544H2.50909C1.12727 3.04544 0 4.17271 0 5.55453V11.4636C0 12.8273 1.12727 13.9545 2.50909 13.9545H13.5091C14.8727 13.9545 16 12.8273 16 11.4454V5.55453C16 4.17271 14.8727 3.04544 13.4909 3.04544ZM9.58182 6.69999H12.3091C12.5818 6.69999 12.8182 6.91817 12.8182 7.20908C12.8182 7.49999 12.6 7.71817 12.3091 7.71817H9.58182C9.30909 7.71817 9.07273 7.49999 9.07273 7.20908C9.07273 6.91817 9.30909 6.69999 9.58182 6.69999ZM7.47273 8.49999C7.47273 9.93635 6.32727 11.1 4.89091 11.1C3.45455 11.1182 2.27273 9.95453 2.27273 8.51817C2.25455 7.0818 3.41818 5.89999 4.85455 5.89999C6.29091 5.8818 7.45455 7.04544 7.47273 8.4818V8.49999ZM12.5091 10.3H9.58182C9.30909 10.3 9.07273 10.0818 9.07273 9.79089C9.07273 9.49999 9.29091 9.2818 9.58182 9.2818H12.5091C12.7818 9.2818 13.0182 9.49999 13.0182 9.79089C13.0182 10.0818 12.7818 10.3 12.5091 10.3Z" fill="#2131E5" />
                            </svg>
                        </div> : null
                }
            </div>
        </>
    )
})

export default Textfield