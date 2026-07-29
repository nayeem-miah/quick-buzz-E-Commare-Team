import React, { useState, useEffect, useRef } from "react";
import { FiChevronDown, FiSearch } from "react-icons/fi";

interface Option {
  value: string;
  label: string;
}

interface CustomDropdownProps {
  value: string;
  onChange: (val: string) => void;
  options: Option[];
  className?: string;
  searchable?: boolean;
}

const CustomDropdown: React.FC<CustomDropdownProps> = ({ value, onChange, options, className, searchable = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const selectedOption = options.find((opt) => opt.value === value) || options[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (!isOpen) {
      setSearchQuery("");
    }
  }, [isOpen]);

  const filteredOptions = searchable 
    ? options.filter(opt => opt.label.toLowerCase().includes(searchQuery.toLowerCase()))
    : options;

  return (
    <div className={`relative ${className || "w-full md:w-48"}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-white border border-gray-200 text-gray-700 text-sm rounded-xl px-4 py-3 flex justify-between items-center focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 cursor-pointer transition-all"
      >
        <span className="truncate">{selectedOption?.label || "Select..."}</span>
        <FiChevronDown
          className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>
      {isOpen && (
        <div className="absolute z-10 w-full mt-2 bg-white border border-gray-100 rounded-xl shadow-lg py-2 max-h-60 flex flex-col">
          {searchable && (
            <div className="px-3 pb-2 mb-1 border-b border-gray-50 sticky top-0 bg-white">
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search..."
                  className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            </div>
          )}
          <div className="overflow-y-auto flex-1">
            {filteredOptions.length === 0 ? (
              <div className="px-4 py-3 text-sm text-gray-500 text-center">No options found</div>
            ) : (
              filteredOptions.map((option) => (
                <div
                  key={option.value}
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                  }}
                  className={`px-4 py-2.5 text-sm cursor-pointer transition-colors ${
                    value === option.value
                      ? "bg-orange-50 text-orange-600 font-semibold"
                      : "text-gray-700 hover:bg-orange-50 hover:text-orange-600"
                  }`}
                >
                  {option.label}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomDropdown;
