import React, { useState } from "react";

const SortDropdown = ({ onSortChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState("Ngày (từ mới đến cũ)");
  const sortOptions = [
    "Tên (A-Z)",
    "Tên (Z-A)",
    "Giá (từ thấp đến cao)",
    "Giá (từ cao đến thấp)",
  ];
  const handleOptionClick = (option) => {
    setSelectedOption(option);
    setIsOpen(false);
    onSortChange(option);
  };

  return (
    <div className="relative inline-block text-left">
      <div>
        <button
          type="button"
          className="inline-flex justify-between items-center w-82 px-4 py-2 text-base font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span>Sắp xếp theo: {selectedOption}</span>
          <svg
            className={`ml-2 h-5 w-5 transition-transform ${
              isOpen ? "transform rotate-180" : ""
            }`}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
          <div className="py-1" role="menu" aria-orientation="vertical">
            {sortOptions.map((option) => (
              <button
                key={option}
                className={`block w-full text-left px-4 py-2 text-base ${
                  selectedOption === option
                    ? "bg-gray-100 text-gray-900 font-medium"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
                role="menuitem"
                onClick={() => handleOptionClick(option)}
              >
                {option}
                {selectedOption === option && (
                  <span className="float-right">✓</span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SortDropdown;
