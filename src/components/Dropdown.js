import axios from "axios";
import React, { useEffect } from "react";
import Select, { components } from "react-select";
const Dropdown = ({ id, name, label, fieldValue, setFieldValue, items, placeholder }) => {
  const formattedOptions = [
    { value: "", label: "Select an option" }, 
    ...items.map(item => ({
      value: item?.id ? item?.id : item?.value,
      label: item?.title ? item?.title : item?.label,
    }))
  ];

  const CustomMenuList = (props) => {
    return (
      <components.MenuList
        {...props}
        className="max-h-48 overflow-y-auto bg-blue-100 
                   [&::-webkit-scrollbar]:w-2 
                   [&::-webkit-scrollbar-thumb]:rounded-full 
                   [&::-webkit-scrollbar-track]:bg-gray-100 
                   [&::-webkit-scrollbar-thumb]:bg-gray-300"
      >
        {props.children}
      </components.MenuList>
    );
  };
  const customStyles = {
    indicatorSeparator: () => ({
      display: "none",
    }),
    control: (baseStyles, state) => ({
      ...baseStyles,
      borderColor: state.isFocused ? "#2131e5" : "#2131e5",
      borderRadius: "8px",
      height: "48px",
      background: "transparent",
      boxShadow: state.isFocused ? "none" : "none",
      "&:hover": {
        borderColor: "#2131e5",
      },
      ">div": {
        paddingLeft: "16px",
      },
      ">div": {
        paddingLeft: "16px",
      },
    }),
    placeholder: (baseStyles) => ({
      ...baseStyles,
      fontSize: "0.875rem",
      lineHeight: "1.25rem",
      fontFamily: "'Open Sans', serif",
    }),
    option: (baseStyles, state) => ({
      ...baseStyles,
      fontFamily: "'Open Sans', serif",
      fontSize: "14px",
      color: state.isSelected ? "#ffffff" : "#1f2937",
      backgroundColor: state.isSelected ? "#2131e5" : "#E3E6FF",
      borderRadius: "8px",
      cursor: "pointer",
      "&:hover": {
        backgroundColor: "#ffffff",
        color: "#1f2937",
      },
    }),
    menu: (baseStyles) => ({
      ...baseStyles,
      borderRadius: "8px",
      background: "#E3E6FF",
    }),
    menuList: (baseStyles) => ({
      ...baseStyles,
      background: "#E3E6FF",
      padding: "10px",
      margin: 0,
    }),
  };
  const CustomDropdownIndicator = (props) => {
    return (
      <div {...props.innerRef} style={{ paddingRight: "10px" }}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1}
          stroke="currentColor"
          className="size-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8.25 15 12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9"
          />
        </svg>
      </div>
    );
  };

  return (
    <>
      <label htmlFor={id} className="block text-sm text-light-black mb-3">
        {label}
      </label>
      <Select
        name={name}
        value={formattedOptions.find((option) => option.value === fieldValue)}
        onChange={(selectedOption) => setFieldValue(selectedOption)}
        placeholder={placeholder?placeholder:"Search Parent Category"}
        styles={customStyles}
        options={formattedOptions}
        isSearchable={true}
        components={{
          DropdownIndicator: CustomDropdownIndicator,
          MenuList: CustomMenuList,
        }}
      />
    </>
  );
};

export default Dropdown;