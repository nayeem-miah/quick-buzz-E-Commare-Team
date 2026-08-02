import { format } from "date-fns";
import React, { useEffect, useRef, useState } from "react";
import { Calendar } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { FiCalendar, FiX } from "react-icons/fi";

interface CustomDatePickerProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const CustomDatePicker: React.FC<CustomDatePickerProps> = ({
  value,
  onChange,
  placeholder = "Select a date",
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [popupStyle, setPopupStyle] = useState<React.CSSProperties>({ left: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedDate = value ? new Date(value + "T00:00:00") : undefined;

  // Smart positioning: check if popup would overflow viewport and flip to right-align
  useEffect(() => {
    if (isOpen && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const calendarWidth = 290; // approximate width of react-date-range Calendar
      const spaceOnRight = window.innerWidth - rect.left;
      if (spaceOnRight < calendarWidth) {
        setPopupStyle({ right: 0, left: "auto" });
      } else {
        setPopupStyle({ left: 0 });
      }
    }
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (date: Date) => {
    onChange(format(date, "yyyy-MM-dd"));
    setIsOpen(false);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange("");
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/5 transition text-sm bg-white flex items-center justify-between gap-2 cursor-pointer"
      >
        <span className={`flex items-center gap-2 ${value ? "text-gray-800" : "text-gray-400"}`}>
          <FiCalendar className="text-orange-500 flex-shrink-0" size={15} />
          {value ? format(selectedDate!, "dd MMM yyyy") : placeholder}
        </span>
        {value && (
          <span
            onClick={handleClear}
            className="text-gray-400 hover:text-orange-500 transition cursor-pointer flex-shrink-0"
          >
            <FiX size={14} />
          </span>
        )}
      </button>

      {isOpen && (
        <div
          style={popupStyle}
          className="absolute z-50 top-full mt-2 bg-white border border-gray-100 rounded-2xl shadow-xl overflow-hidden custom-date-picker"
        >
          <Calendar
            date={selectedDate}
            onChange={handleSelect}
            color="#f97316"
            showMonthAndYearPickers
            rangeColors={["#f97316"]}
          />
        </div>
      )}
    </div>
  );
};

export default CustomDatePicker;

