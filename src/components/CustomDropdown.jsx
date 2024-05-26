import React, { useState } from "react";

const CustomDropdown = ({
  options,
  value,
  onChange,
  placeholder,
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionClick = (option) => {
    onChange(option);
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`}>
      <button
        className="w-full h-10 bg-white rounded-3xl border border-gray-200 flex justify-between items-center px-3"
        onClick={handleToggle}
      >
        <span className="text-black text-sm Gilroy-Regular">
          {value || placeholder}
        </span>
        <svg
          className={`w-4 h-4 transform ${isOpen ? "rotate-180" : "rotate-0"}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 9l-7 7-7-7"
          ></path>
        </svg>
      </button>
      {isOpen && (
        <div className="absolute mt-2 w-[11rem] bg-white rounded-xl border border-gray-200 z-10">
          {options.map((option) => (
            <div
              key={option}
              className="px-3 py-2 text-black border-t border-gray-200 text-sm Gilroy-Medium cursor-pointer hover:bg-gray-100 rounded-lg"
              onClick={() => handleOptionClick(option)}
            >
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomDropdown;
