import React from "react";

const Input = ({ label, fieldtype, placeholder, id, classes, need_icons }) => {
  return (
    <div className={`space-y-2 ${classes}`}>
      <label
        htmlFor={id}
        className="inline-block text-sm font-medium text-gray-800 dark:text-neutral-200"
      >
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={fieldtype}
          className={`py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600 ${need_icons ? 'ps-9 pe-16 shadow-sm focus:z-10' : ''}`}
          placeholder={placeholder}
        />
        {need_icons ? (
          <>
            <div className="absolute inset-y-0 start-0 flex items-center pointer-events-none z-20 ps-4">
              <span className="text-gray-500 dark:text-neutral-500">
                &#8377;
              </span>
            </div>
            <div className="absolute inset-y-0 end-0 flex items-center pointer-events-none z-20 pe-4">
              <span className="text-gray-500 dark:text-neutral-500">IN</span>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
};

export default Input;
