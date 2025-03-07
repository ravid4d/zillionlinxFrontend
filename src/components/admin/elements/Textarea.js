import React from "react";

const Textarea = ({label, placeholder, id}) => {
  return (
    <div className="space-y-2">
      <label
        htmlFor={id}
        className="inline-block text-sm font-medium text-gray-800 dark:text-neutral-200"
      >
        {label}
      </label>
      <textarea
        id={id}
        className="resize-none py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
        rows="6"
        placeholder={placeholder}
      ></textarea>
      <p className="mt-2 text-xs text-gray-500 dark:text-neutral-500" id="hs-textarea-helper-text">Describe the product within 500 characters only.</p>
    </div>
  );
};

export default Textarea;
